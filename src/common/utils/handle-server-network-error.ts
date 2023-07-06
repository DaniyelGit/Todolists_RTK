import { Dispatch } from "redux";
import { AxiosError, isAxiosError } from "axios";
import { appActions } from "app/app-reducer";

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
   const err = e as Error | AxiosError<{ error: string }>;
   if (isAxiosError(err)) {
      const error = err.message ? err.message : "Some error occurred";
      dispatch(appActions.setError({ error }));
   } else {
      dispatch(appActions.setError({ error: `Native error ${err.message}` }));
   }
   dispatch(appActions.setStatus({ status: "failed" }));
};