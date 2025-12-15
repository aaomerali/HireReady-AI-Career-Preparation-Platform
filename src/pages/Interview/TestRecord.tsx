import { GoogleGenAI } from "@google/genai";


const SpeechToText = () => {
  
  

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

async function aiRun() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

  return (
    <div className="max-w-lg mx-auto py-10 px-4 text-center">
      <button onClick={aiRun}>run</button>
    </div>
  );
};

export default SpeechToText;
