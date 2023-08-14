import React, { ChangeEvent, useCallback } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { EditableSpan } from "common/components/EditableSpan/EditableSpan";
import { TaskStatuses } from "common/enums";
import { TaskType } from "features/todolists-list/tasks/api/tasks.api.types";
import { useActions } from "common/hooks";
import { tasksThunks } from "features/todolists-list/tasks/model/tasks-reducer";

type TaskPropsType = {
   task: TaskType;
   todolistId: string;
};
export const Task = React.memo((props: TaskPropsType) => {
   const { removeTask: removeTaskThunk, updateTask: updateTaskThunk } = useActions(tasksThunks);

   const onClickHandler = () => {
      removeTaskThunk({ todoId: props.todolistId, taskId: props.task.id });
   };

   const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
      const status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New;

      updateTaskThunk({
         todoId: props.todolistId,
         taskId: props.task.id,
         domainModel: { status },
      });
   };

   const changeTitleHandler = (title: string) => {
      updateTaskThunk({ todoId: props.todolistId, taskId: props.task.id, domainModel: { title } });
   };

   return (
      <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
         <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            color="primary"
            onChange={changeStatusHandler}
         />

         <EditableSpan value={props.task.title} onChange={changeTitleHandler} />
         <IconButton onClick={onClickHandler}>
            <Delete />
         </IconButton>
      </div>
   );
});
