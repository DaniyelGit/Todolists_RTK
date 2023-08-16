import React from "react";
import { Task } from "features/todolists-list/todolists/ui/todolist/tasks/task/task";
import { TaskStatuses } from "common/enums";
import { TodolistDomainType } from "features/todolists-list/todolists/model/todolists-reducer";
import { TaskType } from "features/todolists-list/tasks/api/tasks.api.types";

type Props = {
   todolist: TodolistDomainType;
   tasks: Array<TaskType>;
};

export const Tasks = ({ todolist, tasks }: Props) => {
   let tasksForTodolist = tasks;

   if (todolist.filter === "active") {
      tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
   }
   if (todolist.filter === "completed") {
      tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
   }

   return (
      <div>
         {tasksForTodolist.map((t) => (
            <Task key={t.id} task={t} todolistId={todolist.id} />
         ))}
      </div>
   );
};
