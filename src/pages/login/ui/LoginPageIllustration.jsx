import imageLogin from "../../../assets/image/login/principal-image.png";
import {
  LoginIllustrationImage,
  LoginIllustrationPanel,
} from "./LoginPage.styles";

export const LoginPageIllustration = () => {
  return (
    <LoginIllustrationPanel>
      <LoginIllustrationImage src={imageLogin} alt="Ilustración ingreso" />
    </LoginIllustrationPanel>
  );
};