import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, AppRootStateType } from "app/store";
import { ResponseType } from "common/api/common-api";

export const createAppAsyncThunks = createAsyncThunk.withTypes<{
   state: AppRootStateType;
   dispatch: AppDispatch;
   rejectValue: null | ResponseType;
}>();
