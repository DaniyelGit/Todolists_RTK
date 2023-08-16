import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import React, { useCallback } from "react";
import { TodolistDomainType, todolistsThunk } from "features/todolists-list/todolists/model/todolists.slice";
import { useActions } from "common/hooks";

type Props = {
   todolist: TodolistDomainType;
};

export const TodolistTitle = ({ todolist }: Props) => {
   const { removeTodolist: removeTodolistThunk, changeTodolistTitle: changeTodolistTitleThunk } = useActions(todolistsThunk);

   const removeTodolistHandler = () => {
      removeTodolistThunk(todolist.id);
   };

   const changeTodolistTitleCallBack = useCallback(
      (title: string) => {
         changeTodolistTitleThunk({ todoId: todolist.id, title });
      },
      [todolist.id]
   );

   return (
      <h3>
         <EditableSpan value={todolist.title} onChange={changeTodolistTitleCallBack} />
         <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
            <Delete />
         </IconButton>
      </h3>
   );
};
