// src/context/SettingsContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { userSettingsApi } from "../api/userSettingsApi";

// Matches the backend defaults in UserSettingsService (LIGHT / USD), used
// only until the real GET /settings response comes back on mount.
const DEFAULT_SETTINGS = { theme: "LIGHT", currencyCode: "USD" };

const SettingsContext = createContext(null);

export function SettingsProvider({ isAuthenticated, children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch once per login. GET /settings lazily creates the row server-side
  // on first call, so this also doubles as "provision settings for a
  // brand-new user" without a separate signup step.
  useEffect(() => {
    if (!isAuthenticated) {
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await userSettingsApi.get();
        if (!isMounted) return;
        setSettings({ theme: res.data.theme, currencyCode: res.data.currencyCode });
        setError(null);
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Failed to load settings. Using defaults.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Optimistic update: apply the change to local state immediately (so the
  // UI feels instant), fire the PATCH, and roll back to whatever the state
  // was right before this call if the server rejects it or the request fails.
  const patch = useCallback(async (partial) => {
    let rollbackTo;
    setSettings((current) => {
      rollbackTo = current;
      return { ...current, ...partial };
    });
    setError(null);

    try {
      const res = await userSettingsApi.update(partial);
      setSettings({ theme: res.data.theme, currencyCode: res.data.currencyCode });
    } catch (err) {
      console.error(err);
      setSettings(rollbackTo);
      setError("Failed to save settings. Please try again.");
    }
  }, []);

  const setTheme = useCallback((theme) => patch({ theme }), [patch]);
  const setCurrencyCode = useCallback((currencyCode) => patch({ currencyCode }), [patch]);

  // Not every ISO 4217 code (e.g. XDR, CLF, USN) is one Intl.NumberFormat's
  // ICU data actually knows how to format as currency — fall back to a
  // plain "CODE 12.34" rendering rather than letting it throw.
  const formatCurrency = useCallback(
    (amount) => {
      const sign = amount < 0 ? "-" : "";
      const abs = Math.abs(amount);
      try {
        return sign + new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: settings.currencyCode,
        }).format(abs);
      } catch {
        return `${sign}${settings.currencyCode} ${abs.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }
    },
    [settings.currencyCode]
  );

  const value = useMemo(
    () => ({
      theme: settings.theme,
      currencyCode: settings.currencyCode,
      isDark: settings.theme === "DARK",
      loading,
      error,
      setTheme,
      setCurrencyCode,
      formatCurrency,
    }),
    [settings, loading, error, setTheme, setCurrencyCode, formatCurrency]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
}
