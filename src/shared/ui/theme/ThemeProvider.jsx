import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ConfigProvider } from "antd";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { getAntdTheme } from "./antdTheme";
import { themeTokens } from "./tokens";

const ThemeModeContext = createContext({
  mode: "light",
  setMode: () => {},
  toggleMode: () => {},
});

const THEME_STORAGE_KEY = "ui-theme";

export const ThemeProvider = ({ children }) => {
  const [mode, setModeState] = useState(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "dark" ? "dark" : "light";
  });

  const setMode = useCallback((nextMode) => {
    setModeState(nextMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setMode]);

  const themeTokensForMode = useMemo(() => themeTokens[mode] || themeTokens.light, [mode]);
  const antdTheme = useMemo(() => getAntdTheme(mode), [mode]);
  const muiTheme = useMemo(() => {
    const base = createTheme({ palette: { mode } });
    base.colors = themeTokensForMode.colors;
    return base;
  }, [mode, themeTokensForMode]);

  const ctx = useMemo(() => ({ mode, setMode, toggleMode }), [mode, setMode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={ctx}>
      <ConfigProvider theme={antdTheme}>
        <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeModeContext);
