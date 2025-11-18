import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";

import { auth } from "./config";

export const signup = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};

export const resetPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};

export const observeUser = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
