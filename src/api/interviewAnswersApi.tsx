// interviewAnswersApi.tsx (ملف جديد)
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import type { UserAnswerData } from "../types/interview"; // يجب التأكد من وجود UserAnswerData
import { aiClient, MODEL_NAME } from "../ai/geminiAI";



const cleanJsonResponse = (text: string) => {
  return text.replace(/```json|```/g, '').trim();
};



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


export const fetchAllUserAnswers = async (userId: string) => {
  const q = query(
    collection(db, "userAnswers"),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data() as UserAnswerData);
};


 


export const generateAiFeedbackThunk = createAsyncThunk<
  { rating: number; feedback: string }, // Explicit return type
  { question: string; correctAns: string; usrAns: string }
>(
  "answers/generateFeedback",
  async ({ question, correctAns, usrAns }) => {
    const prompt = `
      You are an expert technical interviewer.
      
      Context:
      - Question: "${question}"
      - Correct Answer (Reference): "${correctAns}"
      - User's Answer: "${usrAns}"

      Task:
      Compare the User's Answer to the Correct Answer. Assess the accuracy, depth, and clarity.
      Provide a rating from 1 to 10 (integer) and detailed feedback on how to improve.
      
      Output Format:
      Return a single JSON object strictly in this format (no markdown):
      { "rating": number, "feedback": "string" }
    `;

    try {
      const response = await aiClient.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7, // Lower temperature for more consistent grading
        },
      });

      
      const textResponse = response.text; 
      
      if (!textResponse) throw new Error("No AI text response");

      const cleanJson = cleanJsonResponse(textResponse);
      const parsedData = JSON.parse(cleanJson);

      return {
        rating: parsedData.rating || parsedData.ratings, // Handle potential key variation
        feedback: parsedData.feedback
      };

    } catch (error) {
      console.error("AI Feedback Error:", error);
      throw error;
    }
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