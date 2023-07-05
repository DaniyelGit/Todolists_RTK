import {
   AddTasksArgType,
   TaskPriorities,
   TaskStatuses,
   TaskType,
   todolistsAPI,
   UpdateTaskArgType,
   UpdateTaskModelType,
} from "api/todolists-api";
import { AppThunk } from "app/store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { appActions } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";
import { clearStateProject } from "common/actions/clearStateAction";
import { createAppAsyncThunks } from "utils/createAppAsyncThunks";

const slice = createSlice({
   name: "tasks",
   initialState: {} as TasksStateType,
   reducers: {
      removeTask: (state, action: PayloadAction<{ todoId: string; taskId: string }>) => {
         const tasks = state[action.payload.todoId];
         const index = tasks.findIndex((t) => t.id === action.payload.taskId);
         if (index !== -1) tasks.splice(index, 1);
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todoId] = action.payload.tasks;
         })
         .addCase(addTask.fulfilled, (state, action) => {
            state[action.payload.todoId].unshift(action.payload.task);
         })
         .addCase(updateTask.fulfilled, (state, action) => {
            const task = state[action.payload.todoId];
            const index = task.findIndex((t) => t.id === action.payload.taskId);
            if (index !== -1) task[index] = { ...task[index], ...action.payload.domainModel };
         })
         .addCase(todolistsActions.addTodolist, (state, action) => {
            state[action.payload.todolist.id] = [];
         })
         .addCase(todolistsActions.removeTodolists, (state, action) => {
            delete state[action.payload.id];
         })
         .addCase(todolistsActions.setTodolists, (state, action) => {
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
const fetchTasks = createAppAsyncThunks<{ tasks: TaskType[]; todoId: string }, string>(
   "tasks/fetchTasks",
   async (todoId, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;
      try {
         dispatch(appActions.setStatus({ status: "loading" }));
         // request
         const res = await todolistsAPI.getTasks(todoId);
         // response
         const tasks = res.data.items;

         dispatch(appActions.setStatus({ status: "succeeded" }));
         return { tasks, todoId };
      } catch (e) {
         handleServerNetworkError(e, dispatch);
         return rejectWithValue(null);
      }
   }
);

const addTask = createAppAsyncThunks<{ task: TaskType; todoId: string }, AddTasksArgType>(
   "tasks/addTask",
   async (arg, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;

      try {
         dispatch(appActions.setStatus({ status: "loading" }));
         const res = await todolistsAPI.createTask(arg);

         if (res.data.resultCode === 0) {
            const task = res.data.data.item;
            dispatch(appActions.setStatus({ status: "succeeded" }));
            return { task, todoId: arg.todoId };
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

export const removeTaskTC =
   (taskId: string, todoId: string): AppThunk =>
   (dispatch) => {
      todolistsAPI.deleteTask(todoId, taskId).then(() => {
         dispatch(tasksActions.removeTask({ taskId, todoId }));
      });
   };

const updateTask = createAppAsyncThunks<UpdateTaskArgType, UpdateTaskArgType>(
   "tasks/updateTask",
   async (arg, thunkAPI) => {
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

      try {
         const res = await todolistsAPI.updateTask(arg.todoId, arg.taskId, apiModel);

         if (res.data.resultCode === 0) {
            return arg;
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

// types
export type UpdateDomainTaskModelType = {
   title?: string;
   description?: string;
   status?: TaskStatuses;
   priority?: TaskPriorities;
   startDate?: string;
   deadline?: string;
};
export type TasksStateType = {
   [key: string]: Array<TaskType>;
};

// exports
export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { fetchTasks, addTask, updateTask };
