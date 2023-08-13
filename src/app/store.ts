import { AnyAction, combineReducers } from "redux";
import { ThunkAction } from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "features/auth/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";
import { tasksReducer } from "features/todolists-list/tasks/model/tasks-reducer";
import { todolistsReducer } from "features/todolists-list/todolists/model/todolists-reducer";

const rootReducer = combineReducers({
   tasks: tasksReducer,
   todolists: todolistsReducer,
   app: appReducer,
   auth: authReducer,
});

export const store = configureStore({
   reducer: rootReducer,
});

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction | any>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;
