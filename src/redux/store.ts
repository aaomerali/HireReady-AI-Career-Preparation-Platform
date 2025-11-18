import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import resumeReducer from "./slices/resumeSlice";
import interviewReducer from "./slices/interviewSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    resume: resumeReducer,
    interview: interviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
