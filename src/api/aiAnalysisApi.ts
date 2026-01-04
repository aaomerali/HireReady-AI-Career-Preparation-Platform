import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { aiClient, MODEL_NAME } from "../ai/geminiAI";

// تنظيف استجابة JSON من أي Markdown زائد
const cleanJsonResponse = (text: string) => {
  return text.replace(/```json|```/g, '').trim();
};

/**
 * 1. توليد التحليل باستخدام الذكاء الاصطناعي
 */
export const generateCVAnalysisThunk = createAsyncThunk<
  { atsScore: number; feedback: string; missingKeywords: string[]; improvedSummary: string },
  { resumeText: string; targetRole: string }
>(
  "cvAnalysis/generateFeedback",
  async ({ resumeText, targetRole }) => {
    const prompt = `
      You are an expert ATS (Applicant Tracking System) and Career Coach.
      
      Task:
      Analyze the following Resume Text against the Target Role: "${targetRole}".
      
      Assessment Criteria:
      1. ATS Compatibility Score (0-100).
      2. Key strengths of the resume.
      3. Critical weaknesses or missing sections.
      4. Missing keywords specific to the role "${targetRole}".
      5. Suggestions for an improved professional summary.

      Resume Text:
      "${resumeText}"

      Output Format:
      Return a single JSON object strictly in this format (no markdown):
      {
        "atsScore": number,
        "feedback": "detailed string combining strengths and weaknesses",
        "missingKeywords": ["skill1", "skill2"],
        "improvedSummary": "string"
      }
    `;

    try {
      const response = await aiClient.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4, // درجة حرارة منخفضة لنتائج أكثر دقة وتقنية
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
 * 2. حفظ نتيجة التحليل في جدول منفصل (cv_results)
 */
export const saveCVAnalysisResultThunk = createAsyncThunk<
  { id: string },
  {
    resumeId: string; // المرجع للملف الأصلي
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