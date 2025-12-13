import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const SpeechToText = () => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="text-center text-red-600 mt-10">
        ❌ Your browser does not support speech recognition.
      </div>
    );
  }

  const startRecording = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <div className="max-w-lg mx-auto py-10 px-4 text-center">
      <h2 className="text-2xl font-semibold mb-6">🎤 Speech to Text (English)</h2>

      <div className="border border-gray-300 bg-gray-50 min-h-[150px] rounded-lg p-4 text-left shadow-sm">
        {transcript ? (
          <p className="text-gray-800">{transcript}</p>
        ) : (
          <p className="text-gray-400">Start speaking and your text will appear here…</p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        {!listening ? (
          <button
            onClick={startRecording}
            className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-medium hover:bg-green-700 transition"
          >
            ▶️ Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-red-600 text-white rounded-lg text-lg font-medium hover:bg-red-700 transition"
          >
            ⏹️ Stop Recording
          </button>
        )}

        <button
          onClick={resetTranscript}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg text-lg font-medium hover:bg-gray-700 transition"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

export default SpeechToText;
