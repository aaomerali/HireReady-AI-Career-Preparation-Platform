import { createSlice } from "@reduxjs/toolkit";
import { fetchCVFiles, uploadCVMetadata, deleteCVFile } from "../../api/cvAnalysisApi";
import type { CVFile } from '../../types/resume'

interface CVState {
  files: CVFile[];
  loading: boolean;
  error: string | null;
}

const initialState: CVState = {
  files: [],
  loading: false,
  error: null,
};

const cvAnalysisSlice = createSlice({
  name: "cvAnalysis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Files
      .addCase(fetchCVFiles.pending, (state) => {
        state.loading = true;
        state.error = null; // إعادة ضبط الخطأ عند بدء محاولة جديدة
      })
      .addCase(fetchCVFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchCVFiles.rejected, (state, action) => {
        state.loading = false; // 👈 هذا ما سيجعل رسالة التحميل تختفي
        state.error = action.error.message || "Failed to fetch files";
        console.error("Firestore Query Error:", action.error.message);
      })

      // Upload Metadata
      .addCase(uploadCVMetadata.fulfilled, (state, action) => {
        state.files.unshift(action.payload);
      })

      // Delete
      .addCase(deleteCVFile.fulfilled, (state, action) => {
        state.files = state.files.filter(f => f.id !== action.payload);
      });
  },
});

export default cvAnalysisSlice.reducer;