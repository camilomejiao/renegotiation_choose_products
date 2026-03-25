import styled from "@emotion/styled";
import { Card, Typography } from "antd";

export const BannerCard = styled(Card)(({ theme }) => ({
  border: "none",
  borderRadius: 12,
  boxShadow: theme.colors.shadowSm,
  background: theme.colors.bannerGradient,
  color: theme.colors.textOnDark,
}));

export const BannerContent = styled.div({
  padding: "32px 28px",
});

export const BannerTitle = styled(Typography.Title)(({ theme }) => ({
  color: theme.colors.textOnDark,
  margin: 0,
  fontWeight: 800,
}));

export const BannerText = styled(Typography.Text)(({ theme }) => ({
  color: theme.colors.textOnDark,
  fontSize: 14,
}));
