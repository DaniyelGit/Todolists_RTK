import { AnyAction, combineReducers } from "redux";
import { ThunkAction } from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "features/Login/auth-reducer";
import { tasksReducer } from "features/TodolistsList/tasks-reducer";
import { todolistsReducer } from "features/TodolistsList/todolists-reducer";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
   tasks: tasksReducer,
   todolists: todolistsReducer,
   app: appReducer,
   auth: authReducer,
});

export const store = configureStore({
   reducer: rootReducer,
});

export type AppRootStateType = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;
