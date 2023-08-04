import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
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
      builder.addCase(loginTC.fulfilled, (state, action) => {
         state.isLoggedIn = action.payload.isLoggedIn;
      });
   },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;

// thunks

export const loginTC = createAppAsyncThunks<{ isLoggedIn: boolean }, LoginParamsType>(
   "login",
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

export const _loginTC =
   (data: LoginParamsType): AppThunk =>
   (dispatch) => {
      dispatch(appActions.setStatus({ status: "loading" }));
      authAPI
         .login(data)
         .then((res) => {
            if (res.data.resultCode === 0) {
               dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
               dispatch(appActions.setStatus({ status: "succeeded" }));
            } else {
               handleServerAppError(res.data, dispatch);
            }
         })
         .catch((e) => {
            handleServerNetworkError(e, dispatch);
         });
   };
export const logoutTC = (): AppThunk => (dispatch) => {
   dispatch(appActions.setStatus({ status: "loading" }));
   authAPI
      .logout()
      .then((res) => {
         if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
            dispatch(clearStateProject());
            dispatch(appActions.setStatus({ status: "succeeded" }));
         } else {
            handleServerAppError(res.data, dispatch);
         }
      })
      .catch((error) => {
         handleServerNetworkError(error, dispatch);
      });
};
