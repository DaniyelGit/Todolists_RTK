import React, { useCallback, useEffect } from "react";
import { todolistsThunk } from "features/todolists-list/todolists/model/todolists-reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Navigate } from "react-router-dom";
import { selectAuthIsLoggedIn } from "features/auth/auth-selectors";
import { useAppSelector } from "common/hooks/useAppSelector";
import { useActions } from "common/hooks";
import { selectGetTodolists } from "features/todolists-list/todolists/model/todolists-selector";
import { selectGetTasks } from "features/todolists-list/tasks/model/tasks-selector";
import { Todolist } from "features/todolists-list/todolists/ui/todolist/Todolist";

type PropsType = {
   demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
   const todolists = useAppSelector(selectGetTodolists);
   const tasks = useAppSelector(selectGetTasks);
   const isLoggedIn = useAppSelector(selectAuthIsLoggedIn);

   const { fetchTodolists: fetchTodolistsThunk, addTodolist: addTodolistThunk } = useActions(todolistsThunk);

   useEffect(() => {
      if (demo || !isLoggedIn) {
         return;
      }
      fetchTodolistsThunk();
   }, []);

   const addTodolistCallBack = useCallback((title: string) => {
      addTodolistThunk(title);
   }, []);

   if (!isLoggedIn) {
      return <Navigate to={"/login"} />;
   }

   return (
      <>
         <Grid container style={{ padding: "20px" }}>
            <AddItemForm addItem={addTodolistCallBack} />
         </Grid>
         <Grid container spacing={3}>
            {todolists.map((tl) => {
               let allTasksTodolist = tasks[tl.id];

               return (
                  <Grid item key={tl.id}>
                     <Paper style={{ padding: "10px" }}>
                        <Todolist todolist={tl} tasks={allTasksTodolist} demo={demo} />
                     </Paper>
                  </Grid>
               );
            })}
         </Grid>
      </>
   );
};
