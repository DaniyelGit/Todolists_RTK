import { AppRootStateType } from "app/store";
import { TasksStateType } from "features/todolists-list/tasks/model/tasks-reducer";

export const selectGetTasks = (state: AppRootStateType): TasksStateType => state.tasks;
