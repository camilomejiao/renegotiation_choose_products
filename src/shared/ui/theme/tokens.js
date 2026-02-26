export const basePalette = {
  blue900: "#1e3a8a",
  blue800: "#1e40af",
  blue500: "#3b82f6",
  blue200: "#99abe6",
  gray900: "#0f172a",
  gray800: "#1e293b",
  gray700: "#334155",
  gray600: "#475569",
  gray500: "#64748b",
  gray300: "#cbd5e1",
  gray200: "#e2e8f0",
  gray100: "#f1f5f9",
  green600: "#16a34a",
  green500: "#40A581",
  lime500: "#BFD732",
  white: "#ffffff",
};

export const lightTheme = {
  mode: "light",
  colors: {
    headerGradient: `linear-gradient(135deg, ${basePalette.blue200} 0%, ${basePalette.blue900} 100%)`,
    sidebarGradient: `linear-gradient(180deg, ${basePalette.gray700} 0%, ${basePalette.gray800} 100%)`,
    bannerGradient: `linear-gradient(90deg, ${basePalette.green500}, ${basePalette.blue900})`,
    textOnDark: basePalette.white,
    textBase: "#0f172a",
    textMutedOnDark: "rgba(255, 255, 255, 0.8)",
    success: basePalette.green600,
    primary: basePalette.blue900,
    primaryHover: basePalette.blue800,
    surface: basePalette.white,
    borderLight: "rgba(255, 255, 255, 0.12)",
    focusRing: "rgba(255, 255, 255, 0.45)",
    shadowMd: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    shadowSm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  },
};

export const darkTheme = {
  mode: "dark",
  colors: {
    headerGradient: `linear-gradient(135deg, ${basePalette.gray700} 0%, ${basePalette.gray900} 100%)`,
    sidebarGradient: `linear-gradient(180deg, ${basePalette.gray900} 0%, ${basePalette.gray800} 100%)`,
    bannerGradient: `linear-gradient(90deg, ${basePalette.gray700}, ${basePalette.gray900})`,
    textOnDark: basePalette.white,
    textBase: "#f8fafc",
    textMutedOnDark: "rgba(255, 255, 255, 0.75)",
    success: basePalette.green600,
    primary: basePalette.blue500,
    primaryHover: basePalette.blue200,
    surface: basePalette.gray900,
    borderLight: "rgba(255, 255, 255, 0.08)",
    focusRing: "rgba(255, 255, 255, 0.35)",
    shadowMd: "0 6px 16px rgba(0,0,0,0.35)",
    shadowSm: "0 2px 6px rgba(0,0,0,0.25)",
  },
};

export const themeTokens = {
  light: lightTheme,
  dark: darkTheme,
};
