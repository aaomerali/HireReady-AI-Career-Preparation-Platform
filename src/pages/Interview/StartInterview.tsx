import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Redux Imports
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchInterviewById } from "../../api/interviewsApi";
import {
  fetchUserAnswers,
  generateAiFeedbackThunk,
  saveUserAnswerThunk
} from "../../api/interviewAnswersApi";

// Toasts Import
import toast, { Toaster } from "react-hot-toast";

// Hooks & UI Imports
import useSpeechToText, { type ResultType } from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  RefreshCw,
  Save,
  Play,
  Loader2,
  Keyboard,
  CheckCircle,
} from "lucide-react";

import type { AIResponse } from "../../types/interview";
import { SavedModel } from "../../components/Interviews/SavedModel";

const InterviewPage = () => {
  // Redux Hooks
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.uid);

  const { selected: interview, loading: loadingInterview } = useSelector((state: RootState) => state.interview);

  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();

  // Local State
  const [savedQuestionsIndices, setSavedQuestionsIndices] = useState<number[]>([]);
  const [activeIndexState, setActiveIndexState] = useState<number>(0);

  const allQuestionsAnswered = interview?.questions && savedQuestionsIndices.length > 0 && savedQuestionsIndices.length === interview.questions.length;

  // Webcam State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isWebcamOn, setIsWebcamOn] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);

  // Speech to Text
  const {
    isRecording,
    results,
    interimResult,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Answer Inputs
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [typedAnswer, setTypedAnswer] = useState<string>("");
  const [inputMode, setInputMode] = useState<"voice" | "keyboard">("voice");

  // AI & Saving State
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const isCurrentQuestionSaved = savedQuestionsIndices.includes(activeIndexState);

  // 1. Fetch Data
  useEffect(() => {
    const loadData = async () => {
      if (!interviewId) {
        navigate("/");
        return;
      }

      try {
        const fetchedInterview = await dispatch(fetchInterviewById(interviewId)).unwrap();

        if (!fetchedInterview) {
          navigate("/generate", { replace: true });
          return;
        }

        if (userId) {
          const answersResult = await dispatch(fetchUserAnswers({
            mockIdRef: fetchedInterview.id,
            userId: userId,
            allQuestions: fetchedInterview.questions
          })).unwrap();

          setSavedQuestionsIndices(answersResult.savedIndices);
        }

      } catch (err) {
        console.error("Error loading interview data:", err);
        toast.error("Failed to load interview data.");
        navigate("/generate", { replace: true });
      }
    };

    loadData();
  }, [interviewId, userId, dispatch, navigate]);

  // Combine transcripts
  useEffect(() => {
    const finalText = results
      .filter((r): r is ResultType => typeof r !== "string")
      .map((r) => r.transcript)
      .join(" ");

    if (inputMode === "voice") {
      setUserAnswer(finalText.trim());
    }
  }, [results, inputMode]);

  const handleInputModeChange = (mode: "voice" | "keyboard") => {
    if (isCurrentQuestionSaved) return;
    if (isRecording) stopSpeechToText();

    if (inputMode === "voice") setUserAnswer("");
    else setTypedAnswer("");

    setAiResult(null);
    setInputMode(mode);
  };

  const setActiveIndex = (newIndex: number) => {
    if (newIndex !== activeIndexState) {
      const canMove = savedQuestionsIndices.includes(activeIndexState) || aiResult !== null;

      if (!canMove) {
        toast.error("Please answer the current question and save it before moving.");
        return;
      }

      if (!savedQuestionsIndices.includes(newIndex)) {
        setUserAnswer("");
        setTypedAnswer("");
        setAiResult(null);
        if (isRecording) stopSpeechToText();
      }
    }
    setActiveIndexState(newIndex);
  };

  // Webcam Setup
  useEffect(() => {
    let streamRef: MediaStream | null = null;
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Webcam open error", err);
        setIsWebcamOn(false);
      }
    };
    if (isWebcamOn) start();
    return () => {
      if (streamRef) {
        streamRef.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isWebcamOn]);

  const toggleVideo = () => {
    const v = videoRef.current;
    if (!v || !v.srcObject) {
      setIsWebcamOn(true);
      setVideoEnabled(true);
      return;
    }
    const stream = v.srcObject as MediaStream;
    stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    setVideoEnabled((p) => !p);
  };

  const handleSpeakQuestion = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes("Google US English")) || voices.find(v => v.lang.includes("en-US"));
    if (preferredVoice) utt.voice = preferredVoice;
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  // 2. Generate AI Feedback
  const generateFeedbackAndSave = useCallback(async (answer: string) => {
    if (!answer.trim() || answer.trim().length < 20) {
      toast.error("Please provide a longer answer (at least 20 characters).");
      return;
    }
    const q = interview?.questions?.[activeIndexState];
    if (!q) return;

    setIsAiGenerating(true);
    const loadingToast = toast.loading("Generating AI feedback...");
    
    try {
      const result = await dispatch(generateAiFeedbackThunk({
        question: q.question,
        correctAns: q.answer,
        usrAns: answer
      })).unwrap();

      setAiResult(result);
      setUserAnswer(answer.trim());
      toast.success("Feedback generated!", { id: loadingToast });
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error("Failed to generate AI feedback.", { id: loadingToast });
    } finally {
      setIsAiGenerating(false);
    }
  }, [interview, activeIndexState, dispatch]);

  const toggleRecording = async () => {
    if (isCurrentQuestionSaved) return;
    if (inputMode === "voice") {
      if (isRecording) {
        stopSpeechToText();
        await generateFeedbackAndSave(userAnswer);
      } else {
        setUserAnswer("");
        setAiResult(null);
        startSpeechToText();
      }
    } else {
      if (isAiGenerating) return;
      await generateFeedbackAndSave(typedAnswer);
    }
  };

  const resetRecording = () => {
    if (isCurrentQuestionSaved) return;
    if (inputMode === "voice") {
      stopSpeechToText();
      setUserAnswer("");
      startSpeechToText();
    } else {
      setTypedAnswer("");
    }
    setAiResult(null);
  };

  // 3. Save Answer
  const saveAnswer = async () => {
    setSaveModalOpen(false);
    if (isCurrentQuestionSaved) {
      toast.error("This question is already saved.");
      return;
    }

    const finalAnswer = userAnswer || typedAnswer;
    if (!interview || !finalAnswer.trim() || !aiResult) {
      toast.error("Generate feedback before saving.");
      return;
    }

    if (!userId) {
      toast.error("Please login to save your answers.");
      return;
    }

    setSaving(true);
    try {
      const currentQuestion = interview.questions[activeIndexState].question;
      const currentCorrectAns = interview.questions[activeIndexState].answer;

      await dispatch(saveUserAnswerThunk({
        mockIdRef: interview.id,
        question: currentQuestion,
        correct_ans: currentCorrectAns,
        user_ans: finalAnswer,
        feedback: aiResult.feedback,
        rating: aiResult.rating,
        userId: userId,
        questionIndex: activeIndexState
      })).unwrap();

      setSavedQuestionsIndices(p => [...p, activeIndexState]);
      toast.success("Saved! You cannot modify this answer anymore.");

      if (activeIndexState < (interview.questions.length - 1)) {
        setActiveIndex(activeIndexState + 1);
      }

    } catch (err: any) {
      toast.error(err.message || "Error saving answer.");
    } finally {
      setSaving(false);
    }
  };

  const handleFinishInterview = () => {
    if (interviewId) {
      navigate(`/interview/evaluation/${interviewId}`);
    }
  };

  if (loadingInterview) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="p-8">
        <p className="text-center text-gray-600">Interview not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Toaster Component */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-700">Important Information</h2>
        <p className="text-gray-600 mt-2">
          Please enable your webcam and microphone to start the interview.
          <strong className="block mt-2 text-red-700">NOTE: You must Save the answer before moving to the next question.</strong>
        </p>
      </div>

      <div>
        <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
          {interview.questions.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`px-4 py-2 rounded-md border cursor-pointer whitespace-nowrap
              ${activeIndexState === i
                  ? "bg-blue-600 text-white"
                  : savedQuestionsIndices.includes(i)
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 hover:bg-gray-200"}`}
            >
              Q{i + 1} {savedQuestionsIndices.includes(i) && " ✓"}
            </button>
          ))}
        </div>

        <div className="mt-2 p-4 border rounded-md bg-white shadow">
          <h3 className="text-lg font-semibold">{interview.questions[activeIndexState].question}</h3>

          <div className="flex justify-end mt-3">
            <button
              onClick={() => handleSpeakQuestion(interview.questions[activeIndexState].question)}
              className="px-3 py-2 rounded-md bg-indigo-600 text-white cursor-pointer hover:bg-indigo-500 flex items-center gap-2"
            >
              <Play size={16} /> Read Aloud
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Webcam */}
            <div className="flex flex-col items-center">
              <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center relative">
                {isWebcamOn ? (
                  <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-500">Webcam Off</div>
                )}
              </div>
              <div className="flex gap-3 mt-4 flex-wrap justify-center">
                <button
                  onClick={() => setIsWebcamOn((p) => !p)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700"
                >
                  {isWebcamOn ? <VideoOff size={18} /> : <Video size={18} />}
                  {isWebcamOn ? "Turn Off" : "Turn On"}
                </button>
                <button
                  onClick={toggleVideo}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-gray-600"
                >
                  {videoEnabled ? <VideoOff size={18} /> : <Video size={18} />}
                  {videoEnabled ? "Disable Video" : "Enable Video"}
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="flex flex-col">
              {isCurrentQuestionSaved ? (
                <div className="p-4 bg-green-100 text-green-700 font-semibold rounded-lg mb-4 border border-green-200">
                  ✓ Answer Saved.
                </div>
              ) : (
                <>
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => handleInputModeChange("voice")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${inputMode === "voice" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                      <Mic size={18} /> Voice
                    </button>
                    <button
                      onClick={() => handleInputModeChange("keyboard")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${inputMode === "keyboard" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    >
                      <Keyboard size={18} /> Keyboard
                    </button>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={toggleRecording}
                      disabled={isAiGenerating}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${isRecording ? "bg-red-600 text-white" : "bg-indigo-600 text-white"}`}
                    >
                      {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                      {isRecording ? "Stop" : inputMode === "voice" ? "Record" : "Submit"}
                    </button>

                    <button
                      onClick={resetRecording}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg cursor-pointer hover:bg-yellow-400"
                    >
                      <RefreshCw size={18} /> {inputMode === "voice" ? "Reset" : "Clear"}
                    </button>

                    <button
                      onClick={() => setSaveModalOpen(true)}
                      disabled={!aiResult}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${aiResult ? "bg-green-600 text-white cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
                    >
                      {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                      Save Answer
                    </button>
                  </div>
                </>
              )}

              <div className="mt-4 p-4 bg-gray-50 rounded-md border min-h-[140px]">
                <h4 className="font-semibold mb-2">Your Answer</h4>
                {inputMode === "voice" && !isCurrentQuestionSaved ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{userAnswer || interimResult || "Waiting for voice input..."}</p>
                ) : inputMode === "keyboard" && !isCurrentQuestionSaved ? (
                  <textarea
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={5}
                    className="w-full p-2 border rounded-md bg-white"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{userAnswer || typedAnswer || "No answer."}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleFinishInterview}
          disabled={!allQuestionsAnswered}
          className={`flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-lg w-full md:w-auto justify-center
          ${allQuestionsAnswered ? "bg-purple-600 text-white hover:shadow-lg cursor-pointer transform hover:-translate-y-1" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
        >
          <CheckCircle size={24} />
          {allQuestionsAnswered ? "Finish & See Report" : "Answer All Questions"}
        </button>
      </div>

      {saveModalOpen && (
        <SavedModel saveAnswer={saveAnswer} setSaveModalOpen={setSaveModalOpen} saving={saving} />
      )}
    </div>
  );
};

export default InterviewPage;