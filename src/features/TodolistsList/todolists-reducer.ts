import { appActions, RequestStatusType } from "app/app-reducer";
import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tasksThunks } from "features/TodolistsList/tasks-reducer";
import { clearStateProject } from "common/actions/clearStateAction";
import { createAppAsyncThunks, handleServerAppError, handleServerNetworkError } from "common/utils";
import { todolistsAPI, TodolistType } from "features/TodolistsList/todolists-api";
import { ResultCode } from "common/enums";

const slice = createSlice({
   name: "todolists",
   initialState: [] as TodolistDomainType[],
   reducers: {
      /*removeTodolists: (state, action: PayloadAction<{ id: string }>) => {
         const index = state.findIndex((tl) => tl.id === action.payload.id);
         if (index !== -1) state.splice(index, 1);
      },*/
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
   extraReducers: (builder) => {
      builder
         .addCase(clearStateProject, (state, action) => {
            return [];
         })
         .addCase(removeTodolist.fulfilled, (state, action) => {
            const index = state.findIndex((tl) => tl.id === action.payload.todoId);
            if (index !== -1) state.splice(index, 1);
         });
   },
});

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
         .then((res: TodolistType[]) => {
            res.forEach(({ id }) => {
               dispatch(tasksThunks.fetchTasks(id));
            });
         })
         .catch((error) => {
            handleServerNetworkError(error, dispatch);
         });
   };
};

const removeTodolist = createAppAsyncThunks<{ todoId: string }, string>(
   "todolists/removeTodolist",
   async (todoId, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;
      try {
         dispatch(appActions.setStatus({ status: "loading" }));
         const res = await todolistsAPI.deleteTodolist(todoId);
         if (res.data.resultCode === ResultCode.OK) {
            dispatch(appActions.setStatus({ status: "loading" }));
            return { todoId };
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

/*export const removeTodolistTC = (id: string): AppThunk => {
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
};*/
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

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunk = { removeTodolist };
