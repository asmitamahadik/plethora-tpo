import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

const STORAGE_KEY = 'plethora-theme-mode';
const ThemeModeContext = createContext(null);

function readStoredMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function applyDomTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
}

// Applied synchronously at module-evaluation time — before React's first commit/paint —
// so stored dark-mode users never see a light-mode flash of the CSS-variable-driven
// surfaces (card shadow, sidebar hover) while waiting for a useEffect to run.
applyDomTheme(readStoredMode());

function buildThemeConfig(mode) {
  const isDark = mode === 'dark';
  return {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#1d4ed8',
      borderRadius: 10,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    components: {
      Layout: {
        headerBg: isDark ? '#141a2e' : '#ffffff',
        bodyBg: isDark ? '#0b0f1a' : '#f6f7fb',
      },
      Table: {
        headerBg: isDark ? '#1a2238' : '#f5f7fb',
        headerColor: isDark ? '#c7cbe0' : '#55596e',
        borderColor: isDark ? '#242c47' : '#f0f0f0',
        rowHoverBg: isDark ? '#1b2440' : '#f7f9fc',
        headerSplitColor: 'transparent',
        cellPaddingBlock: 14,
      },
      Card: {
        borderRadiusLG: 14,
      },
      Menu: {
        itemSelectedBg: isDark ? 'rgba(29,78,216,0.25)' : 'rgba(29,78,216,0.08)',
      },
    },
  };
}

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(readStoredMode);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // private browsing / storage disabled — theme just won't persist
    }
    applyDomTheme(mode);
  }, [mode]);

  const value = useMemo(() => ({ mode, setMode }), [mode]);
  const themeConfig = useMemo(() => buildThemeConfig(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}
