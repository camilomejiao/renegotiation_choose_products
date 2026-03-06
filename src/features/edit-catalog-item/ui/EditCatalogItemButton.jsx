import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { useThemeMode } from "../../../shared/ui/theme/ThemeProvider";
import { themeTokens } from "../../../shared/ui/theme/tokens";

export const EditCatalogItemButton = ({ onClick }) => {
  const { mode } = useThemeMode();
  const theme = themeTokens[mode] || themeTokens.light;
  const colors = theme.colors;

  return (
    <EditButton
      $bgColor={colors.actionBlueBg}
      $hoverBg={colors.actionBlueHover}
      $textColor={colors.actionBlueText}
      icon={<EditOutlined />}
      onClick={onClick}
    >
      Editar
    </EditButton>
  );
};

const EditButton = styled(Button, {
  shouldForwardProp: (prop) => !["$bgColor", "$hoverBg", "$textColor"].includes(prop),
})`
  border-color: ${({ $bgColor }) => $bgColor};
  background: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};

  &:hover,
  &:focus {
    border-color: ${({ $hoverBg }) => $hoverBg} !important;
    background: ${({ $hoverBg }) => $hoverBg} !important;
    color: ${({ $textColor }) => $textColor} !important;
  }
`;
