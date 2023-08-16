import { Dispatch } from "redux";
import { isAxiosError } from "axios";
import { appActions } from "app/app.slice";

/**
 * Обрабатывает ошибки сети, возникающие при отправке запросов на сервер
 * @param {unknown} err - Ошибка, которая произошла при отправке запроса на сервер
 * @param {Dispatch} dispatch - Функция dispatch из библиотеки Redux для отправки actions
 * @returns {void} - Данная функция ничего не возвращает
 */

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
