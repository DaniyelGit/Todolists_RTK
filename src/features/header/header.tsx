import React, { useCallback } from "react";
import { AppBar, Button, IconButton, LinearProgress, Toolbar, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useAppSelector } from "common/hooks/useAppSelector";
import { selectAppStatus } from "app/app-selectors";
import { selectAuthIsLoggedIn } from "features/auth/auth-selectors";
import { authThunks } from "features/auth/auth.slice";
import { useActions } from "common/hooks";

export const Header = () => {
   const status = useAppSelector(selectAppStatus);
   const isLoggedIn = useAppSelector(selectAuthIsLoggedIn);

   const { logoutTC } = useActions(authThunks);

   const logoutHandler = useCallback(() => {
      logoutTC();
   }, []);

   return (
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
   );
};
