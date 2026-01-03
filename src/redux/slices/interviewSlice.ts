import { createSlice } from "@reduxjs/toolkit";
import {
  fetchInterviews,
  fetchInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
} from "../../api/interviewsApi";
export {
  fetchInterviews,
  fetchInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
};
import { fetchAllUserAnswers } from "../../api/interviewAnswersApi";
import type { InterviewsState } from "../../types/interview";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchStats = createAsyncThunk(
  "interviews/fetchStats",
  async (userId: string) => {
    const answers = await fetchAllUserAnswers(userId);
    
    // Calculate Completed Evaluations (Unique Interviews with answers)
    const uniqueInterviews = new Set(answers.map((a) => a.mockIdRef));
    const completedEvaluations = uniqueInterviews.size;

    // Calculate Average Score
    const totalScore = answers.reduce((acc, curr) => acc + curr.rating, 0);
    const averageScore = answers.length > 0 ? (totalScore / answers.length).toFixed(1) : "0";

    return {
      completedEvaluations,
      averageScore,
    };
  }
);

const initialState: InterviewsState = {
  interviews: [],
  selected: null,
  loading: false,
  error: null,
  stats: {
    completedEvaluations: 0,
    averageScore: "0",
  },
};

const interviewsSlice = createSlice({
  name: "interviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchInterviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload;
      })

      // Fetch one
      .addCase(fetchInterviewById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })

      // Create
      .addCase(createInterview.fulfilled, (state, action) => {
        state.interviews.push(action.payload);
      })

      // Update
      .addCase(updateInterview.fulfilled, (state, action) => {
        state.interviews = state.interviews.map((item) =>
          item.id === action.payload.id ? action.payload.data : item
        );
      })

      // Delete
      .addCase(deleteInterview.fulfilled, (state, action) => {
        state.interviews = state.interviews.filter(
          (item) => item.id !== action.payload
        );
      })

      // Stats
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default interviewsSlice.reducer;
