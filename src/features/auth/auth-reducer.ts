import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { clearStateProject } from "common/actions/clearStateAction";
import { createAppAsyncThunks, handleServerAppError, handleServerNetworkError } from "common/utils";
import { authAPI, LoginParamsType } from "features/auth/auth-api";
import { ResultCode } from "common/enums";

const slice = createSlice({
   name: "auth",
   initialState: {
      isLoggedIn: false,
   },
   reducers: {
      setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
         state.isLoggedIn = action.payload.isLoggedIn;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
         })
         .addCase(logoutTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
         });
   },
});

// thunks

export const loginTC = createAppAsyncThunks<{ isLoggedIn: boolean }, LoginParamsType>(
   "auth/login",
   async (arg, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;

      try {
         dispatch(appActions.setStatus({ status: "loading" }));
         const res = await authAPI.login(arg);
         if (res.data.resultCode === ResultCode.OK) {
            dispatch(appActions.setStatus({ status: "succeeded" }));
            return { isLoggedIn: true };
         } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
         }
      } catch (e) {
         handleServerNetworkError(e, dispatch);
         return rejectWithValue(null);
      }
   }
);

export const logoutTC = createAppAsyncThunks<{ isLoggedIn: boolean }, void>("auth/logout", async (_, thunkAPI) => {
   const { dispatch, rejectWithValue } = thunkAPI;

   try {
      dispatch(appActions.setStatus({ status: "loading" }));
      const res = await authAPI.logout();
      if (res.data.resultCode === ResultCode.OK) {
         dispatch(clearStateProject());
         dispatch(appActions.setStatus({ status: "succeeded" }));
         return { isLoggedIn: false };
      } else {
         handleServerAppError(res.data, dispatch);
         return rejectWithValue(null);
      }
   } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
   }
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = { loginTC, logoutTC };
