import { ResponseType } from "api/todolists-api";
import { Dispatch } from "redux";
import { appActions } from "app/app-reducer";
import { AxiosError, isAxiosError } from "axios";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
   if (data.messages.length) {
      dispatch(appActions.setError({ error: data.messages[0] }));
   } else {
      dispatch(appActions.setError({ error: "Some error occurred" }));
   }
   dispatch(appActions.setStatus({ status: "failed" }));
};

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
