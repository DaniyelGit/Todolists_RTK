import React from "react";
import { useDispatch } from "react-redux";
import { AlertProps, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { appActions } from "app/app-reducer";
import { selectAppError } from "selectors/app-selectors";
import { useAppSelector } from "hooks/useAppSelector";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ErrorSnackbar() {
   const error = useAppSelector(selectAppError);
   const dispatch = useDispatch();

   const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
         return;
      }
      dispatch(appActions.setError({ error: null }));
   };

   // const isOpen = error !== null;

   return (
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
         <Alert onClose={handleClose} severity="error">
            {error}
         </Alert>
      </Snackbar>
   );
}
