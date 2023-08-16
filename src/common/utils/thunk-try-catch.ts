import { handleServerNetworkError } from "common/utils/handle-server-network-error";
import { AppDispatch, AppRootStateType } from "app/store";
import { BaseThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { RejectValueType } from "common/utils/create-app-async-thunks";

export const thunkTryCatch = async <T>(
   thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatch, null | RejectValueType>,
   logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
   const { dispatch, rejectWithValue } = thunkAPI;
   try {
      return await logic();
   } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
   }
};
