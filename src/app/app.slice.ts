import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
   status: "idle" as RequestStatusType,
   error: null as string | null,
   isInitialized: false,
};

const slice = createSlice({
   name: "app",
   initialState,
   reducers: {
      setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
         state.status = action.payload.status;
      },
      setError: (state, actions: PayloadAction<{ error: string | null }>) => {
         state.error = actions.payload.error;
      },
      setIsInitialized: (state, actions: PayloadAction<{ value: boolean }>) => {
         state.isInitialized = actions.payload.value;
      },
   },
});

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type AppInitialStateType = typeof initialState;

export const appSlice = slice.reducer;
export const appActions = slice.actions;
