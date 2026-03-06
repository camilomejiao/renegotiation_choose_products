import { Tag } from "antd";
import styled from "@emotion/styled";
import { useThemeMode } from "../../../shared/ui/theme/ThemeProvider";
import { themeTokens } from "../../../shared/ui/theme/tokens";
import { isCatalogItemOpen } from "../model/selectors";

export const CatalogStatusPill = ({ item }) => {
  const { mode } = useThemeMode();
  const theme = themeTokens[mode] || themeTokens.light;
  const colors = theme.colors;
  const isOpen = isCatalogItemOpen(item);

  return (
    <StatusPill
      $bgColor={isOpen ? colors.statusOpenPillBg : colors.statusClosedPillBg}
      $textColor={isOpen ? colors.statusOpenPillText : colors.statusClosedPillText}
    >
      {item?.status}
    </StatusPill>
  );
};

const StatusPill = styled(Tag, {
  shouldForwardProp: (prop) => !["$bgColor", "$textColor"].includes(prop),
})`
  && {
    margin-inline-end: 0;
    border: none;
    border-radius: 999px;
    padding: 2px 10px;
    font-weight: 600;
    background: ${({ $bgColor }) => $bgColor};
    color: ${({ $textColor }) => $textColor};
  }
`;
