import React from "react";
import { FormikHelpers, useFormik } from "formik";
import { authThunks } from "features/auth/auth-reducer";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material";
import { selectAuthIsLoggedIn } from "features/auth/auth-selectors";
import { useAppSelector } from "common/hooks/useAppSelector";
import { LoginParamsType } from "features/auth/auth-api";
import { ResponseType } from "common/api/common-api";

export const Login = () => {
   const dispatch = useAppDispatch();

   const isLoggedIn = useAppSelector<boolean>(selectAuthIsLoggedIn);

   const formik = useFormik({
      initialValues: {
         email: "",
         password: "",
         rememberMe: false,
      },
      validate: (values) => {
         /* if (!values.email) {
            return {
               email: "Email is required",
            };
         }
         if (!values.password) {
            return {
               password: "Password is required",
            };
         }*/
      },
      onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
         dispatch(authThunks.loginTC(values))
            .unwrap()
            .catch((error: ResponseType) => {
               error.fieldsErrors?.forEach((fieldError) => {
                  formikHelpers.setFieldError(fieldError.field, fieldError.error);
               });
            });
      },
   });

   if (isLoggedIn) {
      return <Navigate to={"/"} />;
   }

   return (
      <Grid container justifyContent="center">
         <Grid item xs={4}>
            <form onSubmit={formik.handleSubmit}>
               <FormControl>
                  <FormLabel>
                     <p>
                        To log in get registered{" "}
                        <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                           here
                        </a>
                     </p>
                     <p>or use common test account credentials:</p>
                     <p> Email: free@samuraijs.com</p>
                     <p>Password: free</p>
                  </FormLabel>
                  <FormGroup>
                     <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
                     {formik.errors.email ? <div>{formik.errors.email}</div> : null}
                     <TextField
                        type="password"
                        label="Password"
                        margin="normal"
                        {...formik.getFieldProps("password")}
                     />
                     {formik.errors.password ? <div>{formik.errors.password}</div> : null}
                     <FormControlLabel
                        label={"Remember me"}
                        control={
                           <Checkbox {...formik.getFieldProps("rememberMe")} checked={formik.values.rememberMe} />
                        }
                     />
                     <Button type={"submit"} variant={"contained"} color={"primary"}>
                        Login
                     </Button>
                  </FormGroup>
               </FormControl>
            </form>
         </Grid>
      </Grid>
   );
};

type FormikErrorsType = {
   email?: string;
   password?: string;
};
