import React, { ChangeEvent } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { TaskStatuses } from "common/enums";
import { TaskType } from "features/todolists-list/tasks/api/tasks.api.types";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/todolists-list/tasks/model/tasks-reducer";

type Props = {
   task: TaskType;
   todolistId: string;
};

export const Task = React.memo(({ task, todolistId }: Props) => {
   const { removeTask: removeTaskThunk, updateTask: updateTaskThunk } = useActions(tasksThunks);

   const removeTaskHandler = () => {
      removeTaskThunk({ todoId: todolistId, taskId: task.id });
   };

   const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
      const status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New;

      updateTaskThunk({
         todoId: todolistId,
         taskId: task.id,
         domainModel: { status },
      });
   };

   const changeTitleHandler = (title: string) => {
      updateTaskThunk({ todoId: todolistId, taskId: task.id, domainModel: { title } });
   };

   return (
      <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
         <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={changeStatusHandler} />

         <EditableSpan value={task.title} onChange={changeTitleHandler} />
         <IconButton onClick={removeTaskHandler}>
            <Delete />
         </IconButton>
      </div>
   );
});
