import React, { useCallback, useEffect } from "react";
import {
   todolistsActions,
   FilterValuesType,
   todolistsThunk,
} from "features/todolists-list/todolists/model/todolists-reducer";
import { tasksThunks } from "features/todolists-list/tasks/model/tasks-reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "./todolists/ui/Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { selectAuthIsLoggedIn } from "features/auth/auth-selectors";
import { useAppSelector } from "common/hooks/useAppSelector";
import { TaskStatuses } from "common/enums";
import { useActions } from "common/hooks";
import { selectGetTodolists } from "features/todolists-list/todolists/model/todolists-selector";
import { selectGetTasks } from "features/todolists-list/tasks/model/tasks-selector";

type PropsType = {
   demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
   const todolists = useAppSelector(selectGetTodolists);
   const tasks = useAppSelector(selectGetTasks);
   const isLoggedIn = useAppSelector(selectAuthIsLoggedIn);

   const {
      fetchTodolists: fetchTodolistsThunk,
      changeTodolistTitle: changeTodolistTitleThunk,
      removeTodolist: removeTodolistThunk,
      addTodolist: addTodolistThunk,
   } = useActions(todolistsThunk);

   const { addTask: addTaskThunk, updateTask: updateTaskThunk, removeTask: removeTaskThunk } = useActions(tasksThunks);

   const { changeTodolistFilter } = useActions(todolistsActions);

   useEffect(() => {
      if (demo || !isLoggedIn) {
         return;
      }
      fetchTodolistsThunk();
   }, []);

   const removeTask = useCallback(function (taskId: string, todoId: string) {
      removeTaskThunk({ todoId, taskId });
   }, []);

   const addTask = useCallback(function (title: string, todoId: string) {
      addTaskThunk({ todoId, title });
   }, []);

   const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todoId: string) {
      updateTaskThunk({ taskId, todoId, domainModel: { status } });
   }, []);

   const changeTaskTitle = useCallback(function (taskId: string, title: string, todoId: string) {
      updateTaskThunk({ taskId, todoId, domainModel: { title } });
   }, []);

   const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
      changeTodolistFilter({ id, filter });
   }, []);

   const removeTodolist = useCallback(function (id: string) {
      removeTodolistThunk(id);
   }, []);

   const changeTodolistTitle = useCallback(function (todoId: string, newTitle: string) {
      changeTodolistTitleThunk({ todoId, newTitle });
   }, []);

   const addTodolist = useCallback((title: string) => {
      addTodolistThunk(title);
   }, []);

   if (!isLoggedIn) {
      return <Navigate to={"/login"} />;
   }

   return (
      <>
         <Grid container style={{ padding: "20px" }}>
            <AddItemForm addItem={addTodolist} />
         </Grid>
         <Grid container spacing={3}>
            {todolists.map((tl) => {
               let allTodolistTasks = tasks[tl.id];

               return (
                  <Grid item key={tl.id}>
                     <Paper style={{ padding: "10px" }}>
                        <Todolist
                           todolist={tl}
                           tasks={allTodolistTasks}
                           removeTask={removeTask}
                           changeFilter={changeFilter}
                           addTask={addTask}
                           changeTaskStatus={changeStatus}
                           removeTodolist={removeTodolist}
                           changeTaskTitle={changeTaskTitle}
                           changeTodolistTitle={changeTodolistTitle}
                           demo={demo}
                        />
                     </Paper>
                  </Grid>
               );
            })}
         </Grid>
      </>
   );
};
