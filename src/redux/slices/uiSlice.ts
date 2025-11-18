import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  loading: boolean;
  modal: string | null;
  notification: string | null;
}

const initialState: UIState = {
  loading: false,
  modal: null,
  notification: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    showModal: (state, action: PayloadAction<string>) => {
      state.modal = action.payload;
    },
    hideModal: (state) => {
      state.modal = null;
    },
    showNotification: (state, action: PayloadAction<string>) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const {
  setLoading,
  showModal,
  hideModal,
  showNotification,
  clearNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
