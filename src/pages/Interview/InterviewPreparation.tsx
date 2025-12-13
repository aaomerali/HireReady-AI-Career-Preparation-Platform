import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchInterviewById } from "../../api/interviewsApi";
import { useParams, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

const InterviewPreparation = () => {
  const { interviewId } = useParams(); 
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { selected, loading } = useSelector(
    (state: RootState) => state.interview
  );

  const [cameraEnabled, setCameraEnabled] = useState(false);

  useEffect(() => {
    if (interviewId) {
      dispatch(fetchInterviewById(interviewId));
    }
  }, [interviewId]);

  if (loading || !selected)
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Interview Preparation
        </h1>

        {/* Interview Info Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            {selected.position}
          </h2>
          <p className="text-gray-600 mt-1">{selected.techStack}</p>
        </div>

        {/* Important Info */}
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-5 rounded-xl mb-8">
          <h3 className="font-semibold text-lg mb-1">⚠️ Important Information</h3>
          <p className="text-sm leading-relaxed">
            Please enable your webcam and microphone to start the AI-generated
            mock interview. You’ll
            receive a personalized report based on your responses at the end.
          </p>
        </div>

        {/* Webcam Preview */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Camera Preview</h3>

          <div className="w-full flex justify-center">
            {cameraEnabled ? (
              <Webcam
                audio={true}
                className="rounded-xl border"
                videoConstraints={{ facingMode: "user" }}
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-600">
                Camera Disabled
              </div>
            )}
          </div>

          {/* Toggle Camera Button */}
          <button
            onClick={() => setCameraEnabled(!cameraEnabled)}
            className={`mt-4 w-full py-3 rounded-xl font-semibold transition ${
              cameraEnabled
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {cameraEnabled ? "Disable Camera" : "Enable Camera"}
          </button>
        </div>

        {/* Start Interview Button */}
        <button
          disabled={!cameraEnabled}
          onClick={() => navigate(`/interview/start/${interviewId}`)}
          className={`w-full py-4 rounded-xl text-lg font-semibold transition ${
            cameraEnabled
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          Start Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewPreparation;
