import { Button } from "@mui/material";
import React, { useCallback, MouseEvent } from "react";
import { FilterValuesType, TodolistDomainType, todolistsActions } from "features/todolists-list/todolists/model/todolists.slice";
import { useActions } from "common/hooks";

type Props = {
   todolist: TodolistDomainType;
};

export const FilterTasksButtons = ({ todolist }: Props) => {
   const { changeTodolistFilter } = useActions(todolistsActions);

   const changeTasksFilterHandler = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
         const filter = event.currentTarget.name as FilterValuesType;
         changeTodolistFilter({ id: todolist.id, filter });
      },
      [todolist.id]
   );

   return (
      <>
         <Button
            variant={todolist.filter === "all" ? "outlined" : "text"}
            onClick={changeTasksFilterHandler}
            color={"inherit"}
            name={"all"}
         >
            All
         </Button>
         <Button
            variant={todolist.filter === "active" ? "outlined" : "text"}
            onClick={changeTasksFilterHandler}
            color={"primary"}
            name={"active"}
         >
            Active
         </Button>
         <Button
            variant={todolist.filter === "completed" ? "outlined" : "text"}
            onClick={changeTasksFilterHandler}
            color={"secondary"}
            name={"completed"}
         >
            Completed
         </Button>
      </>
   );
};
