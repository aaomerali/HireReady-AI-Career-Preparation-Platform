// interviewAnswersApi.tsx (ملف جديد)
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { chatSession } from "../ai/geminiAI";
import type { AIResponse, UserAnswerData } from "../types/interview"; // يجب التأكد من وجود UserAnswerData

// --- AI Generation Helper (Functionally Extracted) ---
const cleanJsonResponse = (responseText: string) => {
  let clean = responseText.trim();
  clean = clean.replace(/(json|```|`)/gi, "");
  const match = clean.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (match) clean = match[0];
  try {
    return JSON.parse(clean);
  } catch (err) {
    console.warn("JSON parse error for AI response:", err, clean);
    throw err;
  }
};

// 1. Fetch User Answers for Interview (used on load)
export const fetchUserAnswers = createAsyncThunk<
  { savedIndices: number[]; answers: UserAnswerData[] },
  { mockIdRef: string; userId: string | null; allQuestions: { question: string }[] }
>(
  "answers/fetchByInterview",
  async ({ mockIdRef, userId, allQuestions }) => {
    if (!userId) {
      return { savedIndices: [], answers: [] };
    }

    const q = query(
      collection(db, "userAnswers"),
      where("userId", "==", userId),
      where("mockIdRef", "==", mockIdRef)
    );
    const snap = await getDocs(q);

    const savedIndices: number[] = [];
    const answers: UserAnswerData[] = [];

    snap.docs.forEach(doc => {
      const data = doc.data() as UserAnswerData;
      const questionText = data.question;
      const index = allQuestions.findIndex(q => q.question === questionText);
      if (index !== -1) {
        savedIndices.push(index);
        answers.push(data); // Optionally save full answer data if needed later
      }
    });

    return { savedIndices, answers };
  }
);


// 2. Generate AI Feedback (Pure function)
export const generateAiFeedbackThunk = createAsyncThunk<
  AIResponse,
  { question: string; correctAns: string; usrAns: string }
>(
  "answers/generateFeedback",
  async ({ question, correctAns, usrAns }) => {
    const prompt = `
      Question: "${question}"
      User Answer: "${usrAns}"
      Correct Answer: "${correctAns}"
      Compare the user's answer to the correct answer, provide a rating from 1 to 10 and useful feedback for improvement.
      Return a JSON object with fields: { "ratings": number, "feedback": string }
      `;
    const ai = await chatSession.sendMessage(prompt);
    const txt = ai.response?.text?.();
    if (!txt) throw new Error("No AI text");
    return cleanJsonResponse(txt) as AIResponse;
  }
);


// 3. Save User Answer (handles Firebase write)
export const saveUserAnswerThunk = createAsyncThunk<
  { rating: number; index: number },
  {
    mockIdRef: string;
    question: string;
    correct_ans: string;
    user_ans: string;
    feedback: string;
    rating: number;
    userId: string | null;
    questionIndex: number;
  }
>(
  "answers/saveAnswer",
  async (data) => {
    // Check duplicate logic (optional, but good practice)
    {/**
      const q = query(
        collection(db, "userAnswers"),
        where("userId", "==", data.userId || null),
        where("question", "==", data.question)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
          throw new Error("DuplicateAnswerError: You have already saved an answer for this question.");
      }
    
    */}

    await addDoc(collection(db, "userAnswers"), {
      mockIdRef: data.mockIdRef,
      question: data.question,
      correct_ans: data.correct_ans,
      user_ans: data.user_ans,
      feedback: data.feedback,
      rating: data.rating,
      userId: data.userId,
      createdAt: serverTimestamp(),
    });

    return { rating: data.rating, index: data.questionIndex };
  }
);