import { instance, ResponseType } from "common/api/common-api";
import { ChangeTodoTitleArgType } from "features/todolists-list/todolists/model/todolists-reducer";

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
   updateTodolist({ todoId, title }: ChangeTodoTitleArgType) {
      return instance.put<ResponseType>(`todo-lists/${todoId}`, { title: title });
   },
};

export type TodolistType = {
   id: string;
   title: string;
   addedDate: string;
   order: number;
};
