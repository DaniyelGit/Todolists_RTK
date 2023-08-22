import React, { FC, useCallback, useEffect } from "react";
import "./App.css";
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "features/auth/Login";
import { authThunks } from "features/auth/auth.slice";
import { AppBar, Button, CircularProgress, Container, IconButton, LinearProgress, Toolbar, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { selectAppStatus, selectIsInitialized } from "app/app-selectors";
import { selectAuthIsLoggedIn } from "features/auth/auth-selectors";
import { useAppSelector } from "common/hooks/useAppSelector";
import { useActions } from "common/hooks";
import { TodolistsList } from "features/todolists-list/todolists-list";

type Props = {
   demo?: boolean;
};

export const App: FC<Props> = ({ demo }) => {
   const status = useAppSelector(selectAppStatus);
   const isInitialized = useAppSelector(selectIsInitialized);
   const isLoggedIn = useAppSelector(selectAuthIsLoggedIn);

   const { logoutTC, initializeAppTC } = useActions(authThunks);

   useEffect(() => {
      initializeAppTC();
   }, []);

   const logoutHandler = useCallback(() => {
      logoutTC();
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
};

export default App;
