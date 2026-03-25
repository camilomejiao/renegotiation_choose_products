import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";
import { useThemeMode } from "../theme/ThemeProvider";
import { themeTokens } from "../theme/tokens";
import { StyledApproveDenyButton } from "./ApproveDenyButton.styles";

export const ApproveDenyButton = ({
  onClick,
  loading = false,
  disabled = false,
  children,
  className,
}) => {
  const { mode } = useThemeMode();
  const colors = (themeTokens[mode] || themeTokens.light).colors;

  return (
    <StyledApproveDenyButton
      className={className}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      $borderColor={colors.actionWarningBorder}
      $textColor={colors.actionWarningText}
      $hoverBg={colors.actionWarningHoverBg}
      $hoverText="#111111"
    >
      <LikeOutlined />
      {children || "Aprobar"}
      <DislikeOutlined />
    </StyledApproveDenyButton>
  );
};
