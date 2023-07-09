import { AddTasksArgType, RemoveTaskArgType, UpdateDomainTaskModelType } from "features/TodolistsList/tasks-reducer";
import { instance, ResponseType } from "common/api/common-api";
import { TaskPriorities, TaskStatuses } from "common/enums";
import { ChangeTodoTitleArgType } from "features/TodolistsList/todolists-reducer";

export const todolistsAPI = {
   getTodolists() {
      return instance.get<TodolistType[]>("todo-lists");
   },
   createTodolist(title: string) {
      return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", { title: title });
   },
   deleteTodolist(id: string) {
      return instance.delete<ResponseType>(`todo-lists/${id}`);
   },
   updateTodolist({ todoId, newTitle }: ChangeTodoTitleArgType) {
      return instance.put<ResponseType>(`todo-lists/${todoId}`, { title: newTitle });
   },
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

export type TodolistType = {
   id: string;
   title: string;
   addedDate: string;
   order: number;
};

export type TaskType = {
   description: string;
   title: string;
   status: TaskStatuses;
   priority: TaskPriorities;
   startDate: string;
   deadline: string;
   id: string;
   todoListId: string;
   order: number;
   addedDate: string;
};
export type UpdateTaskModelType = {
   title: string;
   description: string;
   status: TaskStatuses;
   priority: TaskPriorities;
   startDate: string;
   deadline: string;
};
type GetTasksResponse = {
   error: string | null;
   totalCount: number;
   items: TaskType[];
};
