import { createSlice } from "@reduxjs/toolkit";
import {
  fetchInterviews,
  fetchInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
} from "../../api/interviewsApi";
import type { InterviewsState } from "../../types/interview";

const initialState: InterviewsState = {
  interviews: [],
  selected: null,
  loading: false,
  error: null,
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
      });
  },
});

export default interviewsSlice.reducer;
