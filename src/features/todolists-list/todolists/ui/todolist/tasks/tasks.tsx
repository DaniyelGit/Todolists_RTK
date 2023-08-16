import React from "react";
import { Task } from "features/todolists-list/todolists/ui/todolist/tasks/task/task";
import { TaskStatuses } from "common/enums";
import { TodolistDomainType } from "features/todolists-list/todolists/model/todolists-reducer";
import { useAppSelector } from "common/hooks/useAppSelector";
import { selectGetTasks } from "features/todolists-list/tasks/model/tasks-selector";

type Props = {
   todolist: TodolistDomainType;
};

export const Tasks = ({ todolist }: Props) => {
   const tasks = useAppSelector(selectGetTasks)[todolist.id];

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
