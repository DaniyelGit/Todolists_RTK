import React, { useCallback } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { TodolistDomainType, todolistsThunk } from "features/todolists-list/todolists/model/todolists-reducer";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { TaskStatuses } from "common/enums";
import { TaskType } from "features/todolists-list/tasks/api/tasks.api.types";
import { Task } from "features/todolists-list/todolists/ui/Todolist/task/task";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/todolists-list/tasks/model/tasks-reducer";
import { FilterTasksButtons } from "features/todolists-list/todolists/ui/Todolist/task/filter-tasks-buttons/filter-tasks-buttons";

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

   let tasksForTodolist = props.tasks;

   if (props.todolist.filter === "active") {
      tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New);
   }
   if (props.todolist.filter === "completed") {
      tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed);
   }

   return (
      <div>
         <h3>
            <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleCallBack} />
            <IconButton onClick={removeTodolistHandler} disabled={props.todolist.entityStatus === "loading"}>
               <Delete />
            </IconButton>
         </h3>
         <AddItemForm addItem={addTaskCallBack} disabled={props.todolist.entityStatus === "loading"} />
         <div>
            {tasksForTodolist.map((t) => (
               <Task key={t.id} task={t} todolistId={props.todolist.id} />
            ))}
         </div>
         <div style={{ paddingTop: "10px" }}>
            <FilterTasksButtons todolist={props.todolist} />
         </div>
      </div>
   );
});
