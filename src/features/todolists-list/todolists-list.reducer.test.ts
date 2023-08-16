import {
   todolistsActions,
   TodolistDomainType,
   todolistsSlice,
   todolistsThunk,
} from "features/todolists-list/todolists/model/todolists.slice";
import { tasksSlice, TasksStateType } from "features/todolists-list/tasks/model/tasks.slice";
import { TodolistType } from "features/todolists-list/todolists/api/todolists.api";

test("ids should be equals", () => {
   const startTasksState: TasksStateType = {};
   const startTodolistsState: Array<TodolistDomainType> = [];

   let testTodolist: TodolistType = {
      title: "New todolist",
      id: "any id",
      addedDate: "",
      order: 0,
   };

   const action = todolistsThunk.addTodolist.fulfilled({ todolist: testTodolist }, "requestId", "New todolist");
   debugger;
   const endTasksState = tasksSlice(startTasksState, action);
   const endTodolistsState = todolistsSlice(startTodolistsState, action);

   const keys = Object.keys(endTasksState);
   const idFromTasks = keys[0];
   const idFromTodolists = endTodolistsState[0].id;

   expect(idFromTasks).toBe(action.payload.todolist.id);
   expect(idFromTodolists).toBe(action.payload.todolist.id);
});
