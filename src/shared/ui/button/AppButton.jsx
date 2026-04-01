import { StyledAppButton } from "./AppButton.styles";

export const AppButton = ({
  variant = "primary",
  htmlType = "button",
  children,
  ...rest
}) => {
  return (
    <StyledAppButton $variant={variant} htmlType={htmlType} {...rest}>
      {children}
    </StyledAppButton>
  );
};
