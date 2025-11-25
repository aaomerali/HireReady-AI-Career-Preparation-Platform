// src/redux/slices/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "firebase/auth";



const storedUser = localStorage.getItem("user");
const initialUser: User | null = storedUser ? JSON.parse(storedUser) : null
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}


const initialState: AuthState = {
  user: initialUser,
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
      localStorage.setItem("user", JSON.stringify(action.payload));
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
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, setAuthLoading, setAuthError, logoutUser } =
  authSlice.actions;

export default authSlice.reducer;
