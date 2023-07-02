import { todolistsAPI, TodolistType } from "api/todolists-api";
import { appActions, RequestStatusType } from "app/app-reducer";
import { handleServerNetworkError } from "utils/error-utils";
import { AppThunk } from "app/store";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasksTC } from "features/TodolistsList/tasks-reducer";

const slice = createSlice({
   name: "todolists",
   initialState: [] as TodolistDomainType[],
   reducers: {
      removeTodolists: (state, action: PayloadAction<{ id: string }>) => {
         const index = state.findIndex((tl) => tl.id === action.payload.id);
         if (index !== -1) state.splice(index, 1);
      },
      addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
         const todolist: TodolistDomainType = { ...action.payload.todolist, filter: "all", entityStatus: "idle" };
         state.unshift(todolist);
      },
      changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
         const index = state.findIndex((tl) => tl.id === action.payload.id);
         if (index !== -1) state[index].title = action.payload.title;
      },
      changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
         const index = state.findIndex((tl) => tl.id === action.payload.id);
         if (index !== -1) state[index].filter = action.payload.filter;
      },
      changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
         const index = state.findIndex((tl) => tl.id === action.payload.id);
         if (index !== -1) state[index].entityStatus = action.payload.entityStatus;
      },
      setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
         return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      },
   },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;

// thunks
export const fetchTodolistsTC = (): AppThunk => {
   return (dispatch) => {
      dispatch(appActions.setStatus({ status: "loading" }));
      todolistsAPI
         .getTodolists()
         .then((res) => {
            dispatch(todolistsActions.setTodolists({ todolists: res.data }));
            dispatch(appActions.setStatus({ status: "succeeded" }));
            return res.data;
         })
         .then((res) => {
            res.forEach(({ id }) => {
               dispatch(fetchTasksTC(id));
            });
         })
         .catch((error) => {
            handleServerNetworkError(error, dispatch);
         });
   };
};
export const removeTodolistTC = (id: string): AppThunk => {
   return (dispatch) => {
      //изменим глобальный статус приложения, чтобы вверху полоса побежала
      dispatch(appActions.setStatus({ status: "loading" }));
      //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
      dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: "loading" }));
      todolistsAPI.deleteTodolist(id).then(() => {
         dispatch(todolistsActions.removeTodolists({ id }));
         //скажем глобально приложению, что асинхронная операция завершена
         dispatch(appActions.setStatus({ status: "succeeded" }));
      });
   };
};
export const addTodolistTC = (title: string): AppThunk => {
   return (dispatch) => {
      dispatch(appActions.setStatus({ status: "loading" }));
      todolistsAPI.createTodolist(title).then((res) => {
         dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }));
         dispatch(appActions.setStatus({ status: "succeeded" }));
      });
   };
};
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
   return (dispatch) => {
      todolistsAPI.updateTodolist(id, title).then(() => {
         dispatch(todolistsActions.changeTodolistTitle({ id, title }));
      });
   };
};

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
   filter: FilterValuesType;
   entityStatus: RequestStatusType;
};
