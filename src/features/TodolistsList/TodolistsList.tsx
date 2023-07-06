import React, { useCallback, useEffect } from "react";
import {
   todolistsActions,
   addTodolistTC,
   changeTodolistTitleTC,
   fetchTodolistsTC,
   FilterValuesType,
   removeTodolistTC,
} from "./todolists-reducer";
import { tasksThunks } from "./tasks-reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { selectAuthIsLoggedIn } from "features/auth/auth-selectors";
import { selectGetTasks, selectGetTodolists } from "features/TodolistsList/todolists-selector";
import { useAppSelector } from "common/hooks/useAppSelector";
import { TaskStatuses } from "common/enums";

type PropsType = {
   demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
   const todolists = useAppSelector(selectGetTodolists);
   const tasks = useAppSelector(selectGetTasks);
   const isLoggedIn = useAppSelector(selectAuthIsLoggedIn);

   const dispatch = useAppDispatch();

   useEffect(() => {
      if (demo || !isLoggedIn) {
         return;
      }
      const thunk = fetchTodolistsTC();
      dispatch(thunk);
   }, []);

   const removeTask = useCallback(function (taskId: string, todoId: string) {
      dispatch(tasksThunks.removeTask({ taskId, todoId }));
   }, []);

   const addTask = useCallback(function (title: string, todoId: string) {
      dispatch(tasksThunks.addTask({ todoId, title }));
   }, []);

   const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todoId: string) {
      dispatch(tasksThunks.updateTask({ taskId, todoId, domainModel: { status } }));
   }, []);

   const changeTaskTitle = useCallback(function (taskId: string, title: string, todoId: string) {
      dispatch(tasksThunks.updateTask({ taskId, todoId, domainModel: { title } }));
   }, []);

   const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
      dispatch(todolistsActions.changeTodolistFilter({ id, filter }));
   }, []);

   const removeTodolist = useCallback(function (id: string) {
      const thunk = removeTodolistTC(id);
      dispatch(thunk);
   }, []);

   const changeTodolistTitle = useCallback(function (id: string, title: string) {
      const thunk = changeTodolistTitleTC(id, title);
      dispatch(thunk);
   }, []);

   const addTodolist = useCallback(
      (title: string) => {
         const thunk = addTodolistTC(title);
         dispatch(thunk);
      },
      [dispatch]
   );

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
