import { Dispatch } from "redux";
import { AxiosError, isAxiosError } from "axios";
import { appActions } from "app/app-reducer";

export const handleServerNetworkError = (err: unknown, dispatch: Dispatch) => {
   let errorMessage = "Some error occurred";

   if (isAxiosError(err)) {
      errorMessage = err.response?.data?.message || err?.message || errorMessage;
      dispatch(appActions.setError({ error: errorMessage }));
   } else if (err instanceof Error) {
      errorMessage = `Native error: ${err.message}`;
   } else {
      errorMessage = JSON.stringify(err);
   }
   dispatch(appActions.setError({ error: errorMessage }));
   dispatch(appActions.setAppStatus({ status: "failed" }));
};
