import { ResponseType } from "common/api/common-api";
import { Dispatch } from "redux";
import { appActions } from "app/app-reducer";

/**
 * Обрабатывает ошибку, полученную от сервера, и обновляет состояния приложения
 * @template D - тип данных, возвращаемых сервером
 * @param {ResponseType<D>} data - Данные полученные от сервера
 * @param {Dispatch} dispatch - функция dispatch для обновления состояния приложения
 * @param {boolean} showError - Флаг, указывающий, нужно ли отображать ошибку
 * @returns {void} - ничего не возвращает
 */

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
   if (showError) {
      dispatch(appActions.setError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
   }

   dispatch(appActions.setStatus({ status: "failed" }));
};
