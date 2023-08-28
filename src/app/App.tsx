import React, { FC, useEffect } from "react";
import "./App.css";
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "features/auth/Login";
import { authThunks } from "features/auth/auth.slice";
import { CircularProgress, Container } from "@mui/material";
import { selectIsInitialized } from "app/app-selectors";
import { useAppSelector } from "common/hooks/useAppSelector";
import { useActions } from "common/hooks";
import { TodolistsList } from "features/todolists-list/todolists-list";
import { Header } from "features/header/header";

type Props = {
   demo?: boolean;
};

export const App: FC<Props> = ({ demo }) => {
   const isInitialized = useAppSelector(selectIsInitialized);

   const { initializeAppTC } = useActions(authThunks);

   useEffect(() => {
      initializeAppTC();
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
            <Header />
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
