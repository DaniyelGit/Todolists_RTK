import { createSlice } from "@reduxjs/toolkit";
import { clearStateProject } from "common/actions/clearStateAction";
import { createAppAsyncThunks, handleServerAppError } from "common/utils";
import { ResultCode, TaskPriorities, TaskStatuses } from "common/enums";
import { thunkTryCatch } from "common/utils/thunk-try-catch";
import { todolistsThunk } from "features/todolists-list/todolists/model/todolists.slice";
import {
   RemoveTaskArgType,
   TaskType,
   UpdateDomainTaskModelType,
   UpdateTaskModelType,
} from "features/todolists-list/tasks/api/tasks.api.types";
import { tasksApi } from "features/todolists-list/tasks/api/tasks.api";

const slice = createSlice({
   name: "tasks",
   initialState: {} as TasksStateType,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todoId] = action.payload.tasks;
         })
         .addCase(addTask.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task);
         })
         .addCase(updateTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todoId];
            const index = tasks.findIndex((t) => t.id === action.payload.taskId);
            if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.domainModel };
         })
         .addCase(removeTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todoId];
            const index = tasks.findIndex((t) => t.id === action.payload.taskId);
            if (index !== -1) tasks.splice(index, 1);
         })
         .addCase(todolistsThunk.addTodolist.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = [];
         })
         .addCase(todolistsThunk.removeTodolist.fulfilled, (state, action) => {
            delete state[action.payload.todoId];
         })
         .addCase(todolistsThunk.fetchTodolists.fulfilled, (state, action) => {
            action.payload.todolists.forEach((tl) => {
               state[tl.id] = [];
            });
         })
         .addCase(clearStateProject, () => {
            return {};
         });
   },
});

// thunks
const fetchTasks = createAppAsyncThunks<{ tasks: TaskType[]; todoId: string }, string>("tasks/fetchTasks", async (todoId, thunkAPI) => {
   return thunkTryCatch(thunkAPI, async () => {
      const res = await tasksApi.getTasks(todoId);
      const tasks = res.data.items;
      return { tasks, todoId };
   });
});

const addTask = createAppAsyncThunks<{ task: TaskType }, AddTasksArgType>("tasks/addTask", async (arg, thunkAPI) => {
   const { rejectWithValue } = thunkAPI;

   return thunkTryCatch(thunkAPI, async () => {
      const res = await tasksApi.createTask(arg);

      if (res.data.resultCode === ResultCode.OK) {
         const task = res.data.data.item;
         return { task };
      } else {
         return rejectWithValue(res.data);
      }
   });
});

const removeTask = createAppAsyncThunks<RemoveTaskArgType, RemoveTaskArgType>("tasks/removeTask", async (arg, thunkAPI) => {
   const { dispatch, rejectWithValue } = thunkAPI;

   return thunkTryCatch(thunkAPI, async () => {
      const res = await tasksApi.deleteTask(arg);

      if (res.data.resultCode === ResultCode.OK) {
         return arg;
      } else {
         handleServerAppError(res.data, dispatch);
         return rejectWithValue(null);
      }
   });
});

const updateTask = createAppAsyncThunks<UpdateTaskArgType, UpdateTaskArgType>("tasks/updateTask", async (arg, thunkAPI) => {
   const { dispatch, rejectWithValue, getState } = thunkAPI;

   const task = getState().tasks[arg.todoId].find((t) => t.id === arg.taskId);

   if (!task) {
      console.warn("task not found in the state");
      return rejectWithValue(null);
   }
   const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel,
   };

   return thunkTryCatch(thunkAPI, async () => {
      const res = await tasksApi.updateTask(arg.todoId, arg.taskId, apiModel);

      if (res.data.resultCode === ResultCode.OK) {
         return arg;
      } else {
         handleServerAppError(res.data, dispatch);
         return rejectWithValue(null);
      }
   });
});

// types
export type UpdateTaskArgType = {
   todoId: string;
   taskId: string;
   domainModel: UpdateDomainTaskModelType;
};
export type AddTasksArgType = {
   todoId: string;
   title: string;
};

export type TasksStateType = Record<string, TaskType[]>;

// exports
export const tasksSlice = slice.reducer;
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask };
