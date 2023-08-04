import { authActions } from "features/auth/auth-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { authAPI } from "features/auth/auth-api";
import { ResultCode } from "common/enums";

const initialState = {
   status: "idle" as RequestStatusType,
   error: null as string | null,
   isInitialized: false,
};

const slice = createSlice({
   name: "app",
   initialState,
   reducers: {
      setStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
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

export const appReducer = slice.reducer;
export const appActions = slice.actions;

export const initializeAppTC = (): AppThunk => (dispatch) => {
   authAPI.me().then((res) => {
      if (res.data.resultCode === ResultCode.OK) {
         dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
      } else {
      }

      dispatch(appActions.setIsInitialized({ value: true }));
   });
};

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type AppInitialStateType = typeof initialState;
