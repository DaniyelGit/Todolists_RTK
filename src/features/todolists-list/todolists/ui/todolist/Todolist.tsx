import React, { useCallback } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { TodolistDomainType } from "features/todolists-list/todolists/model/todolists-reducer";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/todolists-list/tasks/model/tasks-reducer";
import { FilterTasksButtons } from "features/todolists-list/todolists/ui/todolist/filter-tasks-buttons/filter-tasks-buttons";
import { Tasks } from "features/todolists-list/todolists/ui/todolist/tasks/tasks";
import { TodolistTitle } from "features/todolists-list/todolists/ui/todolist/todolist-title/todolist-title";

type Props = {
   todolist: TodolistDomainType;
   demo?: boolean;
};

export const Todolist = React.memo((props: Props) => {
   const { addTask: addTaskThunk } = useActions(tasksThunks);

   const addTaskCallBack = useCallback(
      (title: string) => {
         return addTaskThunk({ todoId: props.todolist.id, title }).unwrap();
      },
      [props.todolist.id]
   );

   return (
      <div>
         <TodolistTitle todolist={props.todolist} />
         <AddItemForm addItem={addTaskCallBack} disabled={props.todolist.entityStatus === "loading"} />
         <Tasks todolist={props.todolist} />
         <div style={{ paddingTop: "10px" }}>
            <FilterTasksButtons todolist={props.todolist} />
         </div>
      </div>
   );
});
