import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { AppDispatch, AppRootStateType } from "app/store";
import { appActions } from "app/app-reducer";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { ResponseType } from "common/api/common-api";

export const thunkTryCatch = async (
   thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | ResponseType>,
   logic: Function
) => {
   const { dispatch, rejectWithValue } = thunkAPI;
   dispatch(appActions.setAppStatus({ status: "loading" }));
   try {
      return await logic();
   } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
   } finally {
      dispatch(appActions.setAppStatus({ status: "idle" }));
   }
};
