import {setAppStatusAC} from "app/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { authAPI, LoginParamsType } from "api/todolists-api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";

const slice = createSlice({
   name: "auth",
   initialState: {
      isLoggedIn: false,
   },
   reducers: {
      setIsLoggedIn: (state, action: PayloadAction<{ value: boolean }>) => {
         state.isLoggedIn = action.payload.value;
      },
   },
});

export const authReducer = slice.reducer;
export const { setIsLoggedIn } = slice.actions;

// thunks
export const loginTC =
   (data: LoginParamsType): AppThunk =>
   (dispatch) => {
      dispatch(setAppStatusAC("loading"));
      authAPI
         .login(data)
         .then((res) => {
            if (res.data.resultCode === 0) {
               dispatch(setIsLoggedIn({ value: true }));
               dispatch(setAppStatusAC("succeeded"));
            } else {
               handleServerAppError(res.data, dispatch);
            }
         })
         .catch((error) => {
            handleServerNetworkError(error, dispatch);
         });
   };
export const logoutTC = (): AppThunk => (dispatch) => {
   dispatch(setAppStatusAC("loading"));
   authAPI
      .logout()
      .then((res) => {
         if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn({ value: false }));
            dispatch(setAppStatusAC("succeeded"));
         } else {
            handleServerAppError(res.data, dispatch);
         }
      })
      .catch((error) => {
         handleServerNetworkError(error, dispatch);
      });
};
