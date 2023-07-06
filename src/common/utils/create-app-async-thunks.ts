import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, AppRootStateType } from "app/store";

export const createAppAsyncThunks = createAsyncThunk.withTypes<{
   state: AppRootStateType;
   dispatch: AppDispatch;
   rejectValue: null;
}>();
