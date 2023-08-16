import { RequestStatusType } from "app/app.slice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearStateProject } from "common/actions/clearStateAction";
import { createAppAsyncThunks } from "common/utils";
import { ResultCode } from "common/enums";
import { tasksThunks } from "features/todolists-list/tasks/model/tasks.slice";
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
         .addCase(clearStateProject, () => {
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
            if (index !== -1) state[index].title = action.payload.title;
         });
   },
});

// thunks

const fetchTodolists = createAppAsyncThunks<{ todolists: TodolistType[] }, void>("todolists/fetchTodolists", async (_, thunkAPI) => {
   const { dispatch } = thunkAPI;
   const res = await todolistsAPI.getTodolists();
   res.data.forEach((tl) => {
      dispatch(tasksThunks.fetchTasks(tl.id));
   });
   return { todolists: res.data };
});

const removeTodolist = createAppAsyncThunks<{ todoId: string }, string>("todolists/removeTodolist", async (todoId, thunkAPI) => {
   const { rejectWithValue } = thunkAPI;

   const res = await todolistsAPI.deleteTodolist(todoId);
   if (res.data.resultCode === ResultCode.OK) {
      return { todoId };
   } else {
      return rejectWithValue({ data: res.data, showGlobalError: true });
   }
});

const addTodolist = createAppAsyncThunks<{ todolist: TodolistType }, string>("todolists/addTodolists", async (title, thunkAPI) => {
   const { rejectWithValue } = thunkAPI;
   const res = await todolistsAPI.createTodolist(title);

   if (res.data.resultCode === ResultCode.OK) {
      return { todolist: res.data.data.item };
   } else {
      return rejectWithValue({ data: res.data, showGlobalError: false });
   }
});

const changeTodolistTitle = createAppAsyncThunks<ChangeTodoTitleArgType, ChangeTodoTitleArgType>(
   "todolists/changeTodolistTitle",
   async (arg, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      const res = await todolistsAPI.updateTodolist(arg);
      if (res.data.resultCode === 0) {
         return arg;
      } else {
         return rejectWithValue({ data: res.data, showGlobalError: true });
      }
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
   title: string;
};

export const todolistsSlice = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunk = { removeTodolist, fetchTodolists, addTodolist, changeTodolistTitle };
