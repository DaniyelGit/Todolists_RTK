import { useActions } from "common/hooks";
import { authThunks } from "features/auth/auth.slice";
import { FormikHelpers, useFormik } from "formik";
import { LoginParamsType } from "features/auth/auth-api";
import { ResponseType } from "common/api/common-api";

export const useLogin = () => {
   const { loginTC: loginThunk } = useActions(authThunks);

   const formik = useFormik({
      initialValues: {
         email: "",
         password: "",
         rememberMe: false,
      },
      validate: (values) => {
         const errors: FormikErrorsType = {};

         if (!values.email) {
            errors.email = "Field is required";
         } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = "Invalid email address";
         }

         if (!values.password) {
            errors.password = "Field is required";
         } else if (values.password?.trim().length < 4) {
            errors.password = "should be more three symbols";
         }

         return errors;
      },
      onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
         loginThunk(values)
            .unwrap()
            .catch((error: ResponseType) => {
               error.fieldsErrors?.forEach((fieldError) => {
                  formikHelpers.setFieldError(fieldError.field, fieldError.error);
               });
            });
      },
   });

   return { formik };
};

// types
type FormikErrorsType = Partial<Omit<LoginParamsType, "captcha">>;
