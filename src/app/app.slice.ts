import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnyAction } from "redux";

const initialState = {
   status: "idle" as RequestStatusType,
   error: null as string | null,
   isInitialized: false,
};

const slice = createSlice({
   name: "app",
   initialState,
   reducers: {
      setError: (state, actions: PayloadAction<{ error: string | null }>) => {
         state.error = actions.payload.error;
      },
      setIsInitialized: (state, actions: PayloadAction<{ value: boolean }>) => {
         state.isInitialized = actions.payload.value;
      },
   },
   extraReducers: (builder) => {
      builder
         .addMatcher(
            // pending
            (action: AnyAction) => {
               return action.type.endsWith("/pending");
            },
            (state, action) => {
               state.status = "loading";
            }
         )
         .addMatcher(
            // fulfilled
            (action: AnyAction) => {
               return action.type.endsWith("/fulfilled");
            },
            (state, action) => {
               state.status = "succeeded";
            }
         )
         .addMatcher(
            // rejected
            (action: AnyAction) => {
               return action.type.endsWith("/rejected");
            },
            (state, action) => {
               state.status = "failed";
               debugger;
               // if (action.type.includes("addTodolist")) return;

               if (action.payload) {
                  state.error = action.payload.data.messages[0];
               } else {
                  state.error = action.error.message ? action.error.message : "Some error occurred";
               }
            }
         );
   },
});

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type AppInitialStateType = typeof initialState;

export const appSlice = slice.reducer;
export const appActions = slice.actions;
