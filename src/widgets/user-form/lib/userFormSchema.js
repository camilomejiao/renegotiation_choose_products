import * as yup from "yup";

export const baseInitialValues = {
  isSupplier: false,
  supplier: null,
  supplier_id: "",
  name: "",
  last_name: "",
  identification_number: "",
  cellphone: "",
  email: "",
  role: null,
  username: "",
  password: "",
  active: true,
};

export const buildUserFormValidationSchema = ({ isEdit }) =>
  yup.object().shape({
    isSupplier: yup.boolean().optional(),
    supplier_id: yup
      .string()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .when("isSupplier", {
        is: true,
        then: (schema) => schema.required("Selecciona un proveedor"),
        otherwise: (schema) => schema.notRequired().strip(),
      }),
    username: yup.string().trim().required("El usuario es requerido"),
    password: yup
      .string()
      .trim()
      .when([], (_, schema) =>
        isEdit ? schema.notRequired() : schema.required("La contraseña es requerida")
      ),
    identification_number: yup
      .string()
      .trim()
      .when("isSupplier", {
        is: true,
        then: (schema) =>
          schema.matches(/^[0-9-]+$/, "Solo dígitos o guiones").notRequired(),
        otherwise: (schema) =>
          schema
            .matches(/^\d+$/, "Solo dígitos")
            .required("La cédula/NIT es requerida"),
      }),
    name: yup.string().trim().when("isSupplier", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("El nombre es requerido"),
    }),
    last_name: yup.string().trim().when("isSupplier", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("El apellido es requerido"),
    }),
    email: yup.string().trim().email("Email inválido").when("isSupplier", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("El email es requerido"),
    }),
    cellphone: yup.string().trim().matches(/^\d+$/, "Solo dígitos").when("isSupplier", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("El teléfono es requerido"),
    }),
    role: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue == null ? NaN : Number(originalValue)
      )
      .typeError("Selecciona un rol")
      .required("Selecciona un rol"),
    active: yup.boolean().required("Activo o inactivo"),
  });
