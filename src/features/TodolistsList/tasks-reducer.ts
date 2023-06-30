import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType, AppThunk } from "app/store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { appActions } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";

const slice = createSlice({
   name: "tasks",
   initialState: {} as TasksStateType,
   reducers: {
      removeTask: (state, action: PayloadAction<{ todoId: string; taskId: string }>) => {
         const tasks = state[action.payload.todoId];
         const index = tasks.findIndex((t) => t.id === action.payload.taskId);
         if (index !== -1) tasks.splice(index, 1);
      },
      addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
         state[action.payload.task.todoListId].unshift(action.payload.task);
      },
      updateTask: (
         state,
         action: PayloadAction<{ todoId: string; taskId: string; model: UpdateDomainTaskModelType }>
      ) => {
         const task = state[action.payload.todoId];
         const index = task.findIndex((t) => t.id === action.payload.taskId);
         if (index !== -1) task[index] = { ...task[index], ...action.payload.model };
      },
      setTasks: (state, action: PayloadAction<{ todoId: string; tasks: TaskType[] }>) => {
         state[action.payload.todoId] = action.payload.tasks;
      },
   },
   extraReducers: (builder) => {
      builder
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
         });
   },
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;

// thunks
export const fetchTasksTC =
   (todoId: string): AppThunk =>
   (dispatch) => {
      dispatch(appActions.setStatus({ status: "loading" }));
      todolistsAPI.getTasks(todoId).then((res) => {
         const tasks = res.data.items;
         dispatch(tasksActions.setTasks({ tasks, todoId }));
         dispatch(appActions.setStatus({ status: "succeeded" }));
      });
   };
export const removeTaskTC =
   (taskId: string, todoId: string): AppThunk =>
   (dispatch) => {
      todolistsAPI.deleteTask(todoId, taskId).then(() => {
         dispatch(tasksActions.removeTask({ taskId, todoId }));
      });
   };
export const addTaskTC =
   (title: string, todoId: string): AppThunk =>
   (dispatch) => {
      dispatch(appActions.setStatus({ status: "loading" }));
      todolistsAPI
         .createTask(todoId, title)
         .then((res) => {
            if (res.data.resultCode === 0) {
               const task = res.data.data.item;
               dispatch(tasksActions.addTask({ task }));
               dispatch(appActions.setStatus({ status: "succeeded" }));
            } else {
               handleServerAppError(res.data, dispatch);
            }
         })
         .catch((error) => {
            handleServerNetworkError(error, dispatch);
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
