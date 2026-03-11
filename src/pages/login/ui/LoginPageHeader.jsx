import imageLoginForm from "../../../assets/image/login/login-image-1.png";
import {
  LoginHeader,
  LoginHeaderImage,
  LoginHeaderText,
  LoginHeaderTitle,
} from "./LoginPage.styles";

export const LoginPageHeader = () => {
  return (
    <LoginHeader>
      <LoginHeaderImage src={imageLoginForm} alt="Portal proveedores" />
      <LoginHeaderTitle level={2}>Bienvenido</LoginHeaderTitle>
      <LoginHeaderText>
        Ingrese sus credenciales para acceder
      </LoginHeaderText>
    </LoginHeader>
  );
};