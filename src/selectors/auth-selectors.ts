import { AppRootStateType } from "app/store";

export const selectAuthIsLoggedIn = (state: AppRootStateType): boolean => state.auth.isLoggedIn;
