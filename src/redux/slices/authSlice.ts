// src/redux/slices/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "firebase/auth";

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

 /* const mockUser = {
  "id": "U001",
  "fullName": "Ahmed Ali",
  "email": "ahmed@example.com",
  "passwordHash": "$2a$10$T5sd832H...",
  "avatar": "https://example.com/avatars/ahmed.png",
  "createdAt": "2025-01-12"
}
*/

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, setAuthLoading, setAuthError, logoutUser } =
  authSlice.actions;

export default authSlice.reducer;
