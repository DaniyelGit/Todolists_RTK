import { appActions } from "app/app-reducer";
import { createSlice } from "@reduxjs/toolkit";
import { todolistsActions, todolistsThunk } from "features/TodolistsList/todolists-reducer";
import { clearStateProject } from "common/actions/clearStateAction";
import { createAppAsyncThunks, handleServerAppError, handleServerNetworkError } from "common/utils";
import { TaskType, todolistsAPI, UpdateTaskModelType } from "features/TodolistsList/todolists-api";
import { ResultCode, TaskPriorities, TaskStatuses } from "common/enums";

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
            state[action.payload.todoId].unshift(action.payload.task);
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
const fetchTasks = createAppAsyncThunks<{ tasks: TaskType[]; todoId: string }, string>(
   "tasks/fetchTasks",
   async (todoId, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;
      try {
         dispatch(appActions.setStatus({ status: "loading" }));

         const res = await todolistsAPI.getTasks(todoId);
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

         if (res.data.resultCode === ResultCode.OK) {
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

const removeTask = createAppAsyncThunks<RemoveTaskArgType, RemoveTaskArgType>(
   "tasks/removeTask",
   async (arg, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;
      try {
         dispatch(appActions.setStatus({ status: "loading" }));
         const res = await todolistsAPI.deleteTask(arg);

         if (res.data.resultCode === ResultCode.OK) {
            dispatch(appActions.setStatus({ status: "succeeded" }));
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
         dispatch(appActions.setStatus({ status: "loading" }));
         const res = await todolistsAPI.updateTask(arg.todoId, arg.taskId, apiModel);

         if (res.data.resultCode === ResultCode.OK) {
            dispatch(appActions.setStatus({ status: "succeeded" }));
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

export type AddTasksArgType = {
   todoId: string;
   title: string;
};

export type RemoveTaskArgType = {
   todoId: string;
   taskId: string;
};

export type UpdateTaskArgType = {
   todoId: string;
   taskId: string;
   domainModel: UpdateDomainTaskModelType;
};

// exports
export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask };
