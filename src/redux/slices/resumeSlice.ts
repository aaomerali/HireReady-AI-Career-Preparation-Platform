// src/redux/slices/resumeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Resume {
  id?: string;
  title: string;
  content: object;
  updatedAt: string;
}

interface ResumeState {
  resumes: Resume[];
  loading: boolean;
}

const initialState: ResumeState = {
  resumes: [],
  loading: false,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setResumes: (state, action: PayloadAction<Resume[]>) => {
      state.resumes = action.payload;
    },
    addResume: (state, action: PayloadAction<Resume>) => {
      state.resumes.push(action.payload);
    },
    updateResume: (state, action: PayloadAction<Resume>) => {
      const index = state.resumes.findIndex(
        (res) => res.id === action.payload.id
      );
      if (index !== -1) {
        state.resumes[index] = action.payload;
      }
    },
    deleteResume: (state, action: PayloadAction<string>) => {
      state.resumes = state.resumes.filter((res) => res.id !== action.payload);
    },
    setResumeLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setResumes,
  addResume,
  updateResume,
  deleteResume,
  setResumeLoading,
} = resumeSlice.actions;

export default resumeSlice.reducer;
