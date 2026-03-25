import lockInput from "../../../assets/image/login/lock.png";
import userInput from "../../../assets/image/login/user.png";
import { AppInput } from "../../../shared/ui/input";
import {
  LoginField,
  LoginFieldControl,
  LoginFieldError,
  LoginFieldIcon,
  LoginFieldInputSlot,
  LoginFieldLabel,
  LoginPasswordToggle,
} from "./LoginPage.styles";

export const LoginFormFields = ({
  errors,
  handleBlur,
  handleChange,
  showPassword,
  touched,
  values,
  onTogglePasswordVisibility,
  passwordToggleIcon,
}) => {
  return (
    <>
      <LoginField>
        <LoginFieldLabel htmlFor="email">Email</LoginFieldLabel>
        <LoginFieldControl>
          <LoginFieldIcon src={userInput} alt="" />
          <LoginFieldInputSlot>
            <AppInput
              id="email"
              type="email"
              name="email"
              placeholder="Ingrese su email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.email && touched.email}
              aria-describedby="email-error"
              status={errors.email && touched.email ? "error" : ""}
            />
          </LoginFieldInputSlot>
        </LoginFieldControl>
        {errors.email && touched.email && (
          <LoginFieldError id="email-error">{errors.email}</LoginFieldError>
        )}
      </LoginField>

      <LoginField>
        <LoginFieldLabel htmlFor="password">Contraseña</LoginFieldLabel>
        <LoginFieldControl>
          <LoginFieldIcon src={lockInput} alt="" />
          <LoginFieldInputSlot $hasToggle>
            <AppInput
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Ingrese su contraseña"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.password && touched.password}
              aria-describedby="password-error"
              status={errors.password && touched.password ? "error" : ""}
            />
          </LoginFieldInputSlot>
          <LoginPasswordToggle
            type="button"
            onClick={onTogglePasswordVisibility}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {passwordToggleIcon}
          </LoginPasswordToggle>
        </LoginFieldControl>
        {errors.password && touched.password && (
          <LoginFieldError id="password-error">
            {errors.password}
          </LoginFieldError>
        )}
      </LoginField>
    </>
  );
};
