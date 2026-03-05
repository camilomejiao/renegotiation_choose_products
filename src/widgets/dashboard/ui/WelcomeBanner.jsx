import React from "react";
import {
  BannerCard,
  BannerContent,
  BannerText,
  BannerTitle,
} from "./WelcomeBanner.styles";

export const WelcomeBanner = () => {
  return (
    <BannerCard bodyStyle={{ padding: 0 }}>
      <BannerContent>
        <BannerTitle level={3}>¡Bienvenido!</BannerTitle>
        <BannerText>
          Portal de la <strong>Dirección de Sustitución de Cultivos de Uso Ilícito</strong>.
        </BannerText>
      </BannerContent>
    </BannerCard>
  );
};
