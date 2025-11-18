// src/redux/slices/interviewSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Interview {
  id?: string;
  title: string;
  jobLevel: string;
  questions: string[];
  answers?: string[];
  score?: number;
  createdAt: string;
}

interface InterviewState {
  interviews: Interview[];
  currentInterview: Interview | null;
  loading: boolean;
}

const initialState: InterviewState = {
  interviews: [],
  currentInterview: null,
  loading: false,
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setInterviews: (state, action: PayloadAction<Interview[]>) => {
      state.interviews = action.payload;
    },
    addInterview: (state, action: PayloadAction<Interview>) => {
      state.interviews.push(action.payload);
    },
    setCurrentInterview: (state, action: PayloadAction<Interview | null>) => {
      state.currentInterview = action.payload;
    },
    updateInterview: (state, action: PayloadAction<Interview>) => {
      const index = state.interviews.findIndex(
        (i) => i.id === action.payload.id
      );
      if (index !== -1) {
        state.interviews[index] = action.payload;
      }
    },
    setInterviewLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setInterviews,
  addInterview,
  setCurrentInterview,
  updateInterview,
  setInterviewLoading,
} = interviewSlice.actions;

export default interviewSlice.reducer;
