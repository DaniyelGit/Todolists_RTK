import {
   todolistsActions,
   FilterValuesType,
   TodolistDomainType,
   todolistsSlice,
   todolistsThunk,
} from "features/todolists-list/todolists/model/todolists.slice";
import { v1 } from "uuid";
import { RequestStatusType } from "app/app.slice";
import { TodolistType } from "features/todolists-list/todolists/api/todolists.api";

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType> = [];

beforeEach(() => {
   todolistId1 = v1();
   todolistId2 = v1();
   startState = [
      { id: todolistId1, title: "What to learn", filter: "all", entityStatus: "idle", addedDate: "", order: 0 },
      { id: todolistId2, title: "What to buy", filter: "all", entityStatus: "idle", addedDate: "", order: 0 },
   ];
});

test("correct todolist should be removed", () => {
   const action = todolistsThunk.removeTodolist.fulfilled({ todoId: todolistId1 }, "requestId", todolistId1);

   const endState = todolistsSlice(startState, action);

   expect(endState.length).toBe(1);
   expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
   let testTodolist: TodolistType = {
      title: "New todolist",
      id: "any id",
      addedDate: "",
      order: 0,
   };

   const action = todolistsThunk.addTodolist.fulfilled({ todolist: testTodolist }, "requestId", "New todolist");

   const endState = todolistsSlice(startState, action);

   expect(endState.length).toBe(3);
   expect(endState[0].title).toBe(testTodolist.title);
   expect(endState[0].filter).toBe("all");
});

test("correct todolist should change its name", () => {
   let newTodolistTitle = "New todolist";

   const action = todolistsThunk.changeTodolistTitle.fulfilled({ todoId: todolistId2, title: newTodolistTitle }, "requestId", {
      todoId: todolistId2,
      title: newTodolistTitle,
   });

   const endState = todolistsSlice(startState, action);

   expect(endState[0].title).toBe("What to learn");
   expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed", () => {
   let newFilter: FilterValuesType = "completed";

   const action = todolistsActions.changeTodolistFilter({ id: todolistId2, filter: newFilter });

   const endState = todolistsSlice(startState, action);

   expect(endState[0].filter).toBe("all");
   expect(endState[1].filter).toBe(newFilter);
});
test("todolists should be added", () => {
   debugger;
   const action = todolistsThunk.fetchTodolists.fulfilled({ todolists: startState }, "requestId");

   const endState = todolistsSlice([], action);

   expect(endState.length).toBe(2);
});
test("correct entity status of todolist should be changed", () => {
   let newStatus: RequestStatusType = "loading";

   const action = todolistsActions.changeTodolistEntityStatus({ id: todolistId2, entityStatus: newStatus });

   const endState = todolistsSlice(startState, action);

   expect(endState[0].entityStatus).toBe("idle");
   expect(endState[1].entityStatus).toBe(newStatus);
});
