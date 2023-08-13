import { RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearStateProject } from "common/actions/clearStateAction";
import { createAppAsyncThunks, handleServerAppError } from "common/utils";
import { ResultCode } from "common/enums";
import { thunkTryCatch } from "common/utils/thunk-try-catch";
import { tasksThunks } from "features/todolists-list/tasks/model/tasks-reducer";
import { todolistsAPI, TodolistType } from "features/todolists-list/todolists/api/todolists.api";

const slice = createSlice({
   name: "todolists",
   initialState: [] as TodolistDomainType[],
   reducers: {
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
         })
         .addCase(addTodolist.fulfilled, (state, action) => {
            const todolist: TodolistDomainType = { ...action.payload.todolist, filter: "all", entityStatus: "idle" };
            state.unshift(todolist);
         })
         .addCase(changeTodolistTitle.fulfilled, (state, action) => {
            const index = state.findIndex(({ id }) => id === action.payload.todoId);
            if (index !== -1) state[index].title = action.payload.newTitle;
         });
   },
});

// thunks

const fetchTodolists = createAppAsyncThunks<{ todolists: TodolistType[] }>(
   "todolists/fetchTodolists",
   async (arg, thunkAPI) => {
      const { dispatch } = thunkAPI;
      return thunkTryCatch(thunkAPI, async () => {
         const res = await todolistsAPI.getTodolists();
         res.data.forEach((tl) => {
            dispatch(tasksThunks.fetchTasks(tl.id));
         });
         return { todolists: res.data };
      });
   }
);

const removeTodolist = createAppAsyncThunks<{ todoId: string }, string>(
   "todolists/removeTodolist",
   async (todoId, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;
      return thunkTryCatch(thunkAPI, async () => {
         const res = await todolistsAPI.deleteTodolist(todoId);
         if (res.data.resultCode === ResultCode.OK) {
            return { todoId };
         } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
         }
      });
   }
);

const addTodolist = createAppAsyncThunks<{ todolist: TodolistType }, string>(
   "todolists/addTodolists",
   async (title, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;

      return thunkTryCatch(thunkAPI, async () => {
         const res = await todolistsAPI.createTodolist(title);

         if (res.data.resultCode === ResultCode.OK) {
            return { todolist: res.data.data.item };
         } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
         }
      });
   }
);

const changeTodolistTitle = createAppAsyncThunks<ChangeTodoTitleArgType, ChangeTodoTitleArgType>(
   "todolists/changeTodolistTitle",
   async (arg, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;
      return thunkTryCatch(thunkAPI, async () => {
         const res = await todolistsAPI.updateTodolist(arg);
         if (res.data.resultCode === 0) {
            return arg;
         } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
         }
      });
   }
);

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
   filter: FilterValuesType;
   entityStatus: RequestStatusType;
};
export type ChangeTodoTitleArgType = {
   todoId: string;
   newTitle: string;
};

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunk = { removeTodolist, fetchTodolists, addTodolist, changeTodolistTitle };
