import React, { useCallback, useEffect } from "react";
import "./App.css";
import { TodolistsList } from "features/TodolistsList/TodolistsList";
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { initializeAppTC } from "./app-reducer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "features/auth/Login";
import { authThunks } from "features/auth/auth-reducer";
import {
   AppBar,
   Button,
   CircularProgress,
   Container,
   IconButton,
   LinearProgress,
   Toolbar,
   Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { selectAppStatus, selectIsInitialized } from "app/app-selectors";
import { selectAuthIsLoggedIn } from "features/auth/auth-selectors";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { useAppSelector } from "common/hooks/useAppSelector";

type PropsType = {
   demo?: boolean;
};

function App({ demo = false }: PropsType) {
   const status = useAppSelector(selectAppStatus);
   const isInitialized = useAppSelector(selectIsInitialized);
   const isLoggedIn = useAppSelector(selectAuthIsLoggedIn);
   const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(initializeAppTC());
   }, []);

   const logoutHandler = useCallback(() => {
      dispatch(authThunks.logoutTC());
   }, []);

   if (!isInitialized) {
      return (
         <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
            <CircularProgress />
         </div>
      );
   }

   return (
      <BrowserRouter>
         <div className="App">
            <ErrorSnackbar />
            <AppBar position="static">
               <Toolbar>
                  <IconButton edge="start" color="inherit" aria-label="menu">
                     <Menu />
                  </IconButton>
                  <Typography variant="h6">News</Typography>
                  {isLoggedIn && (
                     <Button color="inherit" onClick={logoutHandler}>
                        Log out
                     </Button>
                  )}
               </Toolbar>
               {status === "loading" && <LinearProgress />}
            </AppBar>
            <Container fixed>
               <Routes>
                  <Route path={"/"} element={<TodolistsList demo={demo} />} />
                  <Route path={"/login"} element={<Login />} />
               </Routes>
            </Container>
         </div>
      </BrowserRouter>
   );
}

export default App;
