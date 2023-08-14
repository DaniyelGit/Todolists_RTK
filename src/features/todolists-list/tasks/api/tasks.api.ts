import { instance, ResponseType } from "common/api/common-api";
import {
   GetTasksResponse,
   RemoveTaskArgType,
   TaskType,
   UpdateTaskModelType,
} from "features/todolists-list/tasks/api/tasks.api.types";
import { AddTasksArgType } from "features/todolists-list/tasks/model/tasks-reducer";

export const tasksApi = {
   getTasks(todolistId: string) {
      return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
   },
   deleteTask(arg: RemoveTaskArgType) {
      return instance.delete<ResponseType>(`todo-lists/${arg.todoId}/tasks/${arg.taskId}`);
   },
   createTask(arg: AddTasksArgType) {
      return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${arg.todoId}/tasks`, { title: arg.title });
   },
   updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
      return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
   },
};
