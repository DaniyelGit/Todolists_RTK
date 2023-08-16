import { AppRootStateType } from "app/store";
import { TodolistDomainType } from "features/todolists-list/todolists/model/todolists.slice";

export const selectGetTodolists = (state: AppRootStateType): TodolistDomainType[] => state.todolists;
