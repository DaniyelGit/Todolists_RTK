import React from "react";
import { AlertProps, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { appActions } from "app/app.slice";
import { selectAppError } from "app/app-selectors";
import { useAppSelector } from "common/hooks/useAppSelector";
import { useActions } from "common/hooks";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ErrorSnackbar() {
   const error = useAppSelector(selectAppError);

   const { setError } = useActions(appActions);

   const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
         return;
      }
      setError({ error: null });
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
