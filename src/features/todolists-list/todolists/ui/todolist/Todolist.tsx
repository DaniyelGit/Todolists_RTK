import React, { useCallback } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { TodolistDomainType, todolistsThunk } from "features/todolists-list/todolists/model/todolists-reducer";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { TaskType } from "features/todolists-list/tasks/api/tasks.api.types";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/todolists-list/tasks/model/tasks-reducer";
import { FilterTasksButtons } from "features/todolists-list/todolists/ui/todolist/filter-tasks-buttons/filter-tasks-buttons";
import { Tasks } from "features/todolists-list/todolists/ui/todolist/tasks/tasks";

type Props = {
   todolist: TodolistDomainType;
   tasks: Array<TaskType>;
   demo?: boolean;
};

export const Todolist = React.memo((props: Props) => {
   const { addTask: addTaskThunk } = useActions(tasksThunks);
   const { removeTodolist: removeTodolistThunk, changeTodolistTitle: changeTodolistTitleThunk } = useActions(todolistsThunk);

   const addTaskCallBack = useCallback(
      (title: string) => {
         addTaskThunk({ todoId: props.todolist.id, title });
      },
      [props.todolist.id]
   );

   const removeTodolistHandler = () => {
      removeTodolistThunk(props.todolist.id);
   };

   const changeTodolistTitleCallBack = useCallback(
      (title: string) => {
         changeTodolistTitleThunk({ todoId: props.todolist.id, title });
      },
      [props.todolist.id]
   );

   return (
      <div>
         <h3>
            <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleCallBack} />
            <IconButton onClick={removeTodolistHandler} disabled={props.todolist.entityStatus === "loading"}>
               <Delete />
            </IconButton>
         </h3>
         <AddItemForm addItem={addTaskCallBack} disabled={props.todolist.entityStatus === "loading"} />
         <Tasks todolist={props.todolist} />
         <div style={{ paddingTop: "10px" }}>
            <FilterTasksButtons todolist={props.todolist} />
         </div>
      </div>
   );
});
