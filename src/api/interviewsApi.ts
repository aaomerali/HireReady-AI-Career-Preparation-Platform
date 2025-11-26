import { createAsyncThunk } from "@reduxjs/toolkit";
import { interviewsService } from "../services/interviewsService";
import type { Interview } from "../types/interview";

// Fetch all
export const fetchInterviews = createAsyncThunk<Interview[]>(
  "interviews/fetchAll",
  async () => {
    return await interviewsService.getAll();
  }
);

// Fetch by id
export const fetchInterviewById = createAsyncThunk<Interview | null, string>(
  "interviews/fetchById",
  async (id) => {
    return await interviewsService.getById(id);
  }
);

// Create
export const createInterview = createAsyncThunk<
  Interview,
  Omit<Interview, "id">
>("interviews/create", async (data) => {
  const id = await interviewsService.add(data);
  return { id, ...data };
});

// Update
export const updateInterview = createAsyncThunk<
  { id: string; data: Interview },
  { id: string; data: Partial<Interview> }
>("interviews/update", async ({ id, data }) => {
  await interviewsService.update(id, data);

  return { 
    id, 
    data: { id, ...data } as Interview 
  };
});

// Delete
export const deleteInterview = createAsyncThunk<string, string>(
  "interviews/delete",
  async (id) => {
    await interviewsService.remove(id);
    return id;
  }
);
