import { Timestamp } from "firebase/firestore";

export interface Question {
  question: string;
  answer: string;
}

export interface Interview {
  id: string;
  position: string;
  description: string;
  experience: number;
  userId: string | undefined;
  techStack: string;
  questions: { question: string; answer: string }[];
  createdAt: Timestamp | Date;
  updateAt: Timestamp | Date;
}


export interface InterviewsState {
  interviews: Interview[];
  selected: Interview | null;
  loading: boolean;
  error: string | null;
}

export interface UserAnswerData {
    mockIdRef: string; 
    question: string;
    correct_ans: string;
    user_ans: string;
    feedback: string;
    rating: number; 
    userId: string | null;
    createdAt: any; 
    questionIndex: number;
}

export interface AIResponse {
  rating: number;
  feedback: string;
}

