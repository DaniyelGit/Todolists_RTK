import React, { FC } from "react";
import { Navigate } from "react-router-dom";
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material";
import { selectAuthIsLoggedIn } from "features/auth/auth-selectors";
import { useAppSelector } from "common/hooks/useAppSelector";
import { useLogin } from "features/auth/lib/useLogin";

export const Login: FC = () => {
   const isLoggedIn = useAppSelector(selectAuthIsLoggedIn);

   const { formik } = useLogin();

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
                     {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
                     <TextField type="password" label="Password" margin="normal" {...formik.getFieldProps("password")} />
                     {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}
                     <FormControlLabel
                        label={"Remember me"}
                        control={<Checkbox {...formik.getFieldProps("rememberMe")} checked={formik.values.rememberMe} />}
                     />
                     <Button type={"submit"} variant={"contained"} color={"primary"} disabled={formik.isSubmitting || !formik.isValid}>
                        Login
                     </Button>
                  </FormGroup>
               </FormControl>
            </form>
         </Grid>
      </Grid>
   );
};
