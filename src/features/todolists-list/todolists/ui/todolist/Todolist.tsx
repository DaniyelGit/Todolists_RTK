import React, { FC, useCallback } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { TodolistDomainType } from "features/todolists-list/todolists/model/todolists.slice";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/todolists-list/tasks/model/tasks.slice";
import { FilterTasksButtons } from "features/todolists-list/todolists/ui/todolist/filter-tasks-buttons/filter-tasks-buttons";
import { Tasks } from "features/todolists-list/todolists/ui/todolist/tasks/tasks";
import { TodolistTitle } from "features/todolists-list/todolists/ui/todolist/todolist-title/todolist-title";

type Props = {
   todolist: TodolistDomainType;
   demo?: boolean;
};

export const Todolist: FC<Props> = React.memo(({ todolist, ...restProps }) => {
   const { addTask: addTaskThunk } = useActions(tasksThunks);

   const addTaskCallBack = useCallback(
      (title: string) => {
         return addTaskThunk({ todoId: todolist.id, title }).unwrap();
      },
      [todolist.id]
   );

   return (
      <div>
         <TodolistTitle todolist={todolist} />
         <AddItemForm addItem={addTaskCallBack} disabled={todolist.entityStatus === "loading"} />
         <Tasks todolist={todolist} />
         <div style={{ paddingTop: "10px" }}>
            <FilterTasksButtons todolist={todolist} />
         </div>
      </div>
   );
});
