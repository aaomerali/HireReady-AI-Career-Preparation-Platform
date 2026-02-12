import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { aiClient, MODEL_NAME } from "../ai/geminiAI";

// Clean JSON response from any extra Markdown
const cleanJsonResponse = (text: string) => {
  return text.replace(/```json|```/g, '').trim();
};

/**
 * 1. Generate analysis using AI
 */
export const generateCVAnalysisThunk = createAsyncThunk<
  {
      score: number;
      summary: string; atsScore: number; feedback: string; missingKeywords: string[]; improvedSummary: string 
},
  { resumeText: string; targetRole: string }
>(
  "cvAnalysis/generateFeedback",
  async ({ resumeText, targetRole }) => {
    const prompt = `
    You are an expert Applicant Tracking System (ATS) and professional career coach.
    Analyze the following resume text for the target role: "${targetRole}".
    
    Resume Content:
    "${resumeText}"
    
    Provide a detailed analysis in the following JSON format ONLY:
    {
      "score": (number between 0-100 representing job match percentage),
      "summary": "a brief professional overview of the candidate",
      "strengths": ["at least 3 key strengths"],
      "improvements": ["at least 3 specific areas to improve"],
      "missingKeywords": ["industry keywords or skills missing from the resume"]
    }
    `;

    try {
      const response = await aiClient.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
          config: {
          responseMimeType: "application/json",
          temperature: 0.4, // Low temperature for more precise and technical results
        },
      });

      const textResponse = response.text;
      if (!textResponse) throw new Error("No AI response received");

      const cleanJson = cleanJsonResponse(textResponse);
      return JSON.parse(cleanJson);

    } catch (error) {
      console.error("AI CV Analysis Error:", error);
      throw error;
    }
  }
);

/**
 * 2. Save analysis result in a separate collection (cv_results)
 */
export const saveCVAnalysisResultThunk = createAsyncThunk<
  { id: string },
  {
    resumeId: string; // reference to the original file
    userId: string | null;
    atsScore: number;
    feedback: string;
    missingKeywords: string[];
    improvedSummary: string;
  }
>(
  "cvAnalysis/saveResult",
  async (data) => {
    const docRef = await addDoc(collection(db, "cv_results"), {
      resumeId: data.resumeId,
      userId: data.userId,
      atsScore: data.atsScore,
      feedback: data.feedback,
      missingKeywords: data.missingKeywords,
      improvedSummary: data.improvedSummary,
      createdAt: serverTimestamp(),
    });

    return { id: docRef.id };
  }
);


export const fetchCVAnalysisResultThunk = createAsyncThunk(
  "cvAnalysis/fetchResult",
  async (resumeId: string) => {
    try {
      const q = query(
        collection(db, "cv_results"), 
        where("resumeId", "==", resumeId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error("Analysis report not found");
      }

      // Take the first document matching the query
      const data = querySnapshot.docs[0].data();
      return data; // result will be available in action.payload
    } catch (error: any) {
      console.error("Fetch Analysis Error:", error.message);
      throw error;
    }
  }
);