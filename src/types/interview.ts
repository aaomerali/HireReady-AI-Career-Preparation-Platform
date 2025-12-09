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