import { todolistsActions, TodolistDomainType, todolistsReducer, todolistsThunk } from "./todolists-reducer";
import { tasksReducer, TasksStateType } from "./tasks-reducer";
import { TodolistType } from "features/TodolistsList/todolists-api";

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
   const endTasksState = tasksReducer(startTasksState, action);
   const endTodolistsState = todolistsReducer(startTodolistsState, action);

   const keys = Object.keys(endTasksState);
   const idFromTasks = keys[0];
   const idFromTodolists = endTodolistsState[0].id;

   expect(idFromTasks).toBe(action.payload.todolist.id);
   expect(idFromTodolists).toBe(action.payload.todolist.id);
});
