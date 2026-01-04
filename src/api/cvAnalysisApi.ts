import { createAsyncThunk } from "@reduxjs/toolkit";
import { cvAnalysisService} from "../services/cvAnalysisService";
import type {CVFile} from '../types/resume'


export const fetchCVFiles = createAsyncThunk<CVFile[], string>(
  "cvAnalysis/fetchAllFiles",
  async (userId) => {
    return await cvAnalysisService.getAll(userId);
  }
);

export const uploadCVMetadata = createAsyncThunk<
  CVFile,
  Omit<CVFile, "id" | "createdAt">
>("cvAnalysis/uploadMetadata", async (data) => {
  const id = await cvAnalysisService.add(data);
  // نرجع البيانات مع المعرف، لاحظ أن createdAt سيتم تحديثه عند الجلب التالي من السيرفر
  return { id, ...data, createdAt: new Date().toISOString() } as CVFile;
});

export const deleteCVFile = createAsyncThunk<string, string>(
  "cvAnalysis/deleteFile",
  async (id) => {
    await cvAnalysisService.remove(id);
    return id;
  }
);