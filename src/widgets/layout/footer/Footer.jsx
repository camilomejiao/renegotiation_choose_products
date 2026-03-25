import React from "react";
import imgFooter from "../../../assets/image/footer/footer.png";
import { FooterImage, FooterShell } from "./Footer.styles";

export const Footer = () => {
  return (
    <FooterShell>
      <FooterImage src={imgFooter} alt="Footer" />
    </FooterShell>
  );
};
