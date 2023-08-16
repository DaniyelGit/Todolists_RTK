import { AnyAction, combineReducers } from "redux";
import { ThunkAction } from "redux-thunk";
import { appSlice } from "app/app.slice";
import { authSlice } from "features/auth/auth.slice";
import { configureStore } from "@reduxjs/toolkit";
import { tasksSlice } from "features/todolists-list/tasks/model/tasks.slice";
import { todolistsSlice } from "features/todolists-list/todolists/model/todolists.slice";

const rootReducer = combineReducers({
   tasks: tasksSlice,
   todolists: todolistsSlice,
   app: appSlice,
   auth: authSlice,
});

export const store = configureStore({
   reducer: rootReducer,
});

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction | any>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;
