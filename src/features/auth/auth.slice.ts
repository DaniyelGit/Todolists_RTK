import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app.slice";
import { clearStateProject } from "common/actions/clearStateAction";
import { createAppAsyncThunks, handleServerNetworkError } from "common/utils";
import { authAPI, LoginParamsType } from "features/auth/auth-api";
import { ResultCode } from "common/enums";

const slice = createSlice({
   name: "auth",
   initialState: {
      isLoggedIn: false,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
         })
         .addCase(logoutTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
         })
         .addCase(initializeAppTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
         });
   },
});

// thunks

export const loginTC = createAppAsyncThunks<{ isLoggedIn: boolean }, LoginParamsType>("auth/login", async (arg, thunkAPI) => {
   const { rejectWithValue } = thunkAPI;
   const res = await authAPI.login(arg);
   if (res.data.resultCode === ResultCode.OK) {
      return { isLoggedIn: true };
   } else {
      const isShowAppError = !res.data.fieldsErrors.length;
      return rejectWithValue({ data: res.data, showGlobalError: isShowAppError });
   }
});

export const logoutTC = createAppAsyncThunks<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, thunkAPI) => {
   const { dispatch, rejectWithValue } = thunkAPI;

   const res = await authAPI.logout();
   if (res.data.resultCode === ResultCode.OK) {
      dispatch(clearStateProject());
      return { isLoggedIn: false };
   } else {
      return rejectWithValue({ data: res.data, showGlobalError: true });
   }
});

export const initializeAppTC = createAppAsyncThunks<{ isLoggedIn: boolean }, undefined>("app/initializedApp", async (_, thunkAPI) => {
   const { dispatch, rejectWithValue } = thunkAPI;

   try {
      const res = await authAPI.me();
      if (res.data.resultCode === ResultCode.OK) {
         return { isLoggedIn: true };
      } else {
         return rejectWithValue(null);
      }
   } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
   } finally {
      dispatch(appActions.setIsInitialized({ value: true }));
   }
});

export const authSlice = slice.reducer;
export const authThunks = { loginTC, logoutTC, initializeAppTC };
