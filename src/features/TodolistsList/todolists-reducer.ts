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
   },
   extraReducers: (builder) => {
      builder
         .addCase(clearStateProject, (state, action) => {
            return [];
         })
         .addCase(removeTodolist.fulfilled, (state, action) => {
            const index = state.findIndex((tl) => tl.id === action.payload.todoId);
            if (index !== -1) state.splice(index, 1);
         })
         .addCase(fetchTodolists.fulfilled, (state, action) => {
            return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
         });
   },
});

// thunks

const fetchTodolists = createAppAsyncThunks<{ todolists: TodolistType[] }>(
   "todolists/fetchTodolists",
   async (arg, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;
      try {
         dispatch(appActions.setStatus({ status: "loading" }));
         const res = await todolistsAPI.getTodolists();
         res.data.forEach((tl) => {
            dispatch(tasksThunks.fetchTasks(tl.id));
         });
         dispatch(appActions.setStatus({ status: "succeeded" }));
         return { todolists: res.data };
      } catch (e) {
         handleServerNetworkError(e, dispatch);
         return rejectWithValue(null);
      }
   }
);

const removeTodolist = createAppAsyncThunks<{ todoId: string }, string>(
   "todolists/removeTodolist",
   async (todoId, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;
      try {
         dispatch(appActions.setStatus({ status: "loading" }));
         const res = await todolistsAPI.deleteTodolist(todoId);
         if (res.data.resultCode === ResultCode.OK) {
            dispatch(appActions.setStatus({ status: "succeeded" }));
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
export const todolistsThunk = { removeTodolist, fetchTodolists };
