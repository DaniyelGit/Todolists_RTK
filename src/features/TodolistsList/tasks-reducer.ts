import {
   AddTasksArgType,
   TaskPriorities,
   TaskStatuses,
   TaskType,
   todolistsAPI,
   UpdateTaskModelType,
} from "api/todolists-api";
import { AppRootStateType, AppThunk } from "app/store";
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
      updateTask: (
         state,
         action: PayloadAction<{ todoId: string; taskId: string; model: UpdateDomainTaskModelType }>
      ) => {
         const task = state[action.payload.todoId];
         const index = task.findIndex((t) => t.id === action.payload.taskId);
         if (index !== -1) task[index] = { ...task[index], ...action.payload.model };
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

export const updateTaskTC =
   (taskId: string, domainModel: UpdateDomainTaskModelType, todoId: string): AppThunk =>
   (dispatch, getState: () => AppRootStateType) => {
      const state = getState();
      const task = state.tasks[todoId].find((t) => t.id === taskId);
      if (!task) {
         //throw new Error("task not found in the state");
         console.warn("task not found in the state");
         return;
      }

      const apiModel: UpdateTaskModelType = {
         deadline: task.deadline,
         description: task.description,
         priority: task.priority,
         startDate: task.startDate,
         title: task.title,
         status: task.status,
         ...domainModel,
      };

      todolistsAPI
         .updateTask(todoId, taskId, apiModel)
         .then((res) => {
            if (res.data.resultCode === 0) {
               dispatch(tasksActions.updateTask({ taskId, todoId, model: domainModel }));
            } else {
               handleServerAppError(res.data, dispatch);
            }
         })
         .catch((error) => {
            handleServerNetworkError(error, dispatch);
         });
   };

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
export const tasksThunks = { fetchTasks, addTask };
