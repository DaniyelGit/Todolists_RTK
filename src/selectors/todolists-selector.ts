import { AppRootStateType } from "app/store";
import { TodolistDomainType } from "features/TodolistsList/todolists-reducer";
import { TasksStateType } from "features/TodolistsList/tasks-reducer";

export const selectGetTodolists = (state: AppRootStateType): TodolistDomainType[] => state.todolists;
export const selectGetTasks = (state: AppRootStateType): TasksStateType => state.tasks;
