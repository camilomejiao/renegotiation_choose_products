import * as yup from "yup";

export const loginInitialValues = {
  email: "",
  password: "",
};

export const loginSchema = yup.object().shape({
  email: yup.string().required("Email es requerido"),
  password: yup.string().required("Contraseña es requerida"),
});
