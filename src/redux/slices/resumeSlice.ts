import { createSlice } from "@reduxjs/toolkit";
import { fetchCVFiles, uploadCVMetadata, deleteCVFile } from "../../api/cvAnalysisApi";
import type {CVFile} from '../../types/resume'

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
      })
      .addCase(fetchCVFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
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