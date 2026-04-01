import { themeTokens } from "./tokens";

export const getAntdTheme = (mode = "light") => {
  const tokens = themeTokens[mode] || themeTokens.light;
  return {
    token: {
      colorPrimary: tokens.colors.primary,
      colorSuccess: tokens.colors.success,
      colorTextBase: tokens.colors.textBase,
      colorBgBase: tokens.colors.surface,
      borderRadius: 8,
      boxShadow: tokens.colors.shadowSm,
    },
    components: {
      Button: {
        borderRadius: 8,
      },
      Card: {
        borderRadiusLG: 12,
      },
    },
  };
};
