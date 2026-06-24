import { StyledStatusPill } from "./StatusPill.styles";

export const StatusPill = ({
  children,
  color = "default",
  backgroundColor,
  borderColor,
  textColor,
  uppercase = false,
  padding = "4px 10px",
  minHeight = "auto",
  fontSize = "inherit",
  fontWeight = 600,
}) => {
  const usesCustomPalette = Boolean(backgroundColor || borderColor || textColor);

  return (
    <StyledStatusPill
      color={usesCustomPalette ? undefined : color}
      $backgroundColor={backgroundColor}
      $borderColor={borderColor}
      $textColor={textColor}
      $uppercase={uppercase}
      $padding={padding}
      $minHeight={minHeight}
      $fontSize={fontSize}
      $fontWeight={fontWeight}
    >
      {children}
    </StyledStatusPill>
  );
};
