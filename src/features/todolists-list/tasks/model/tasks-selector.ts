import { AppRootStateType } from "app/store";
import { TasksStateType } from "features/todolists-list/tasks/model/tasks.slice";

export const selectGetTasks = (state: AppRootStateType): TasksStateType => state.tasks;
