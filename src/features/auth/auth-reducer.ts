import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "app/store";
import { appActions } from "app/app-reducer";
import { clearStateProject } from "common/actions/clearStateAction";
import { handleServerAppError, handleServerNetworkError } from "common/utils";
import { authAPI, LoginParamsType } from "features/auth/auth-api";

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
// export const { setIsLoggedIn } = slice.actions;
export const authActions = slice.actions;

// thunks
export const loginTC =
   (data: LoginParamsType): AppThunk =>
   (dispatch) => {
      dispatch(appActions.setStatus({ status: "loading" }));
      authAPI
         .login(data)
         .then((res) => {
            if (res.data.resultCode === 0) {
               dispatch(authActions.setIsLoggedIn({ value: true }));
               dispatch(appActions.setStatus({ status: "succeeded" }));
            } else {
               handleServerAppError(res.data, dispatch);
            }
         })
         .catch((error) => {
            handleServerNetworkError(error, dispatch);
         });
   };
export const logoutTC = (): AppThunk => (dispatch) => {
   dispatch(appActions.setStatus({ status: "loading" }));
   authAPI
      .logout()
      .then((res) => {
         if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({ value: false }));
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
