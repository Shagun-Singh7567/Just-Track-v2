import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { authStorage } from "../api/authStorage";

// Common currencies first; your backend accepts any valid ISO 4217 code,
// this list is just a convenient shortlist for the picker.
const CURRENCIES = [
  { code: "USD", label: "US Dollar" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "British Pound" },
  { code: "INR", label: "Indian Rupee" },
  { code: "JPY", label: "Japanese Yen" },
  { code: "AUD", label: "Australian Dollar" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "CHF", label: "Swiss Franc" },
  { code: "CNY", label: "Chinese Yuan" },
  { code: "SGD", label: "Singapore Dollar" },
  { code: "MXN", label: "Mexican Peso" },
  { code: "PEN", label: "Peruvian Sol" },
  { code: "BRL", label: "Brazilian Real" },
  { code: "ZAR", label: "South African Rand" },
  { code: "AED", label: "UAE Dirham" },
  { code: "KRW", label: "South Korean Won" },
  { code: "HKD", label: "Hong Kong Dollar" },
  { code: "NZD", label: "New Zealand Dollar" },
  { code: "SEK", label: "Swedish Krona" },
  { code: "NOK", label: "Norwegian Krone" },
  { code: "RUB", label: "Russian Ruble" },
  { code: "THB", label: "Thai Baht" },
  { code: "IDR", label: "Indonesian Rupiah" },
];

const NAVBAR_STYLES = `
.jt-navbar {
  --jt-ink: #14201d;
  --jt-ink-soft: rgba(20, 32, 29, 0.62);
  --jt-paper: #f4efe4;
  --jt-paper-raised: #fbf8f1;
  --jt-sage: #5c7a6c;
  --jt-sage-soft: #e2e8e0;
  --jt-gold: #b8923d;
  --jt-stamp: #a6432d;
  --jt-border: rgba(20, 32, 29, 0.12);
  --jt-font-display: "Fraunces", "Iowan Old Style", Georgia, serif;
  --jt-font-body: "Inter", "Segoe UI", system-ui, sans-serif;

  display: flex;
  align-items: center;
  gap: 32px;
  height: 64px;
  padding: 0 24px;
  background: var(--jt-paper);
  border-bottom: 1px solid var(--jt-border);
  font-family: var(--jt-font-body);
  color: var(--jt-ink);
  position: relative;
  transition: background 0.35s ease, color 0.35s ease, border-color 0.35s ease;
}

.jt-navbar.jt-dark {
  --jt-ink: #e8e4d9;
  --jt-ink-soft: rgba(232, 228, 217, 0.62);
  --jt-paper: #14171c;
  --jt-paper-raised: #1c2027;
  --jt-sage: #4fae7c;
  --jt-sage-soft: rgba(79, 174, 124, 0.16);
  --jt-gold: #d4a94a;
  --jt-stamp: #e0645c;
  --jt-border: rgba(232, 228, 217, 0.14);
}

.jt-navbar__brand {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.jt-navbar__mark {
  font-family: var(--jt-font-display);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.08em;
  border: 1px solid var(--jt-ink);
  border-radius: 3px;
  padding: 2px 6px;
}

.jt-navbar__name {
  font-family: var(--jt-font-display);
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.01em;
}

.jt-navbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.jt-avatar-btn {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid var(--jt-ink);
  background: var(--jt-sage);
  color: var(--jt-paper);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--jt-font-display);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.15s ease;
}

.jt-avatar-btn:hover,
.jt-avatar-btn:focus-visible {
  box-shadow: 0 0 0 3px var(--jt-paper), 0 0 0 4.5px var(--jt-gold);
  outline: none;
}

.jt-avatar-btn__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

.jt-dropdown {
  position: relative;
}

.jt-navbar-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 300px;
  background: var(--jt-paper-raised);
  border: 1px solid var(--jt-border);
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(20, 32, 29, 0.16);
  padding: 14px;
  z-index: 50;
}

.jt-navbar-panel__note {
  font-size: 12px;
  color: var(--jt-ink-soft);
  margin: 0 0 10px;
}

.jt-navbar-panel__note--error {
  color: var(--jt-stamp);
}

.jt-profile-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.jt-avatar-upload {
  position: relative;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 1.5px dashed var(--jt-gold);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--jt-sage);
  color: var(--jt-paper);
  font-family: var(--jt-font-display);
  font-weight: 600;
  flex-shrink: 0;
}

.jt-avatar-upload__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

.jt-avatar-upload__edit {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: rgba(20, 32, 29, 0.55);
  color: var(--jt-paper);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.jt-avatar-upload:hover .jt-avatar-upload__edit,
.jt-avatar-upload:focus-within .jt-avatar-upload__edit {
  opacity: 1;
}

.jt-profile-header__text {
  min-width: 0;
}

.jt-profile-header__name {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.jt-profile-header__email {
  font-size: 12px;
  color: var(--jt-ink-soft);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.jt-navbar-panel__section {
  margin-bottom: 12px;
}

.jt-navbar-panel__label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--jt-ink-soft);
  margin-bottom: 6px;
}

.jt-segmented {
  display: flex;
  border: 1px solid var(--jt-border);
  border-radius: 8px;
  overflow: hidden;
}

.jt-segmented__option {
  flex: 1;
  padding: 6px 0;
  font-size: 12px;
  font-weight: 600;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--jt-ink-soft);
  transition: background 0.15s ease, color 0.15s ease;
}

.jt-segmented__option + .jt-segmented__option {
  border-left: 1px solid var(--jt-border);
}

.jt-segmented__option--active {
  background: var(--jt-sage);
  color: var(--jt-paper);
}

.jt-select {
  width: 100%;
  padding: 7px 8px;
  border: 1px solid var(--jt-border);
  border-radius: 8px;
  background: var(--jt-paper);
  color: var(--jt-ink);
  font-size: 12.5px;
  font-family: var(--jt-font-body);
}

.jt-navbar-panel__link {
  display: block;
  font-size: 12.5px;
  color: var(--jt-sage);
  text-decoration: none;
  padding: 8px 0 4px;
  border-top: 1px solid var(--jt-border);
  margin-top: 4px;
}

.jt-navbar-panel__link:hover {
  color: var(--jt-ink);
}

.jt-navbar-panel__logout {
  width: 100%;
  margin-top: 6px;
  padding: 8px 0;
  border: 1px solid var(--jt-border);
  border-radius: 8px;
  background: transparent;
  color: var(--jt-stamp);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.jt-navbar-panel__logout:hover {
  background: rgba(166, 67, 45, 0.08);
}

@media (max-width: 720px) {
  .jt-navbar-panel {
    position: fixed;
    top: 68px;
    left: 12px;
    right: 12px;
    width: auto;
    max-width: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .jt-avatar-btn,
  .jt-avatar-upload__edit,
  .jt-segmented__option,
  .jt-navbar-panel__logout {
    transition: none;
  }
}
`;

export default function Navbar({ onLogout }) {
  const {
    isDark,
    currencyCode,
    loading: settingsLoading,
    error: settingsError,
    setTheme,
    setCurrencyCode,
  } = useSettings();

  const user = authStorage.getUser();

  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const profileRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setProfileOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    // Preview only, held in component state. Nothing is persisted or
    // uploaded until there's a backend endpoint + storage for it.
  }

  function handleLogout() {
    authStorage.clear();
    setProfileOpen(false);
    if (onLogout) onLogout();
    else window.location.href = "/login";
  }

  const initials = user?.name
    ? user.name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <>
      <style>{NAVBAR_STYLES}</style>

      <nav className={isDark ? "jt-navbar jt-dark" : "jt-navbar jt-light"}>
        <div className="jt-navbar__brand">
          <span className="jt-navbar__mark">JT</span>
          <span className="jt-navbar__name">Just Track</span>
        </div>

        <div className="jt-navbar__actions">
          <div className="jt-dropdown" ref={profileRef}>
            <button
              type="button"
              className="jt-avatar-btn"
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((o) => !o)}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="" className="jt-avatar-btn__img" />
              ) : (
                <span className="jt-avatar-btn__initials">{initials}</span>
              )}
            </button>

            {profileOpen && (
              <div className="jt-navbar-panel jt-navbar-panel--profile" role="menu">
                <div className="jt-profile-header">
                  <label className="jt-avatar-upload" title="Change picture">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="" className="jt-avatar-upload__img" />
                    ) : (
                      <span className="jt-avatar-upload__initials">{initials}</span>
                    )}
                    <span className="jt-avatar-upload__edit">Edit</span>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                  </label>
                  <div className="jt-profile-header__text">
                    <p className="jt-profile-header__name">{user?.name || "Signed in"}</p>
                    <p className="jt-profile-header__email">{user?.email}</p>
                  </div>
                </div>

                {avatarPreview && (
                  <p className="jt-navbar-panel__note">
                    Preview only — picture uploads aren't saved yet.
                  </p>
                )}

                <div className="jt-navbar-panel__section">
                  <span className="jt-navbar-panel__label">Theme</span>
                  <div className="jt-segmented" role="radiogroup" aria-label="Theme">
                    <button
                      type="button"
                      className={`jt-segmented__option${!isDark ? " jt-segmented__option--active" : ""}`}
                      role="radio"
                      aria-checked={!isDark}
                      onClick={() => setTheme("LIGHT")}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      className={`jt-segmented__option${isDark ? " jt-segmented__option--active" : ""}`}
                      role="radio"
                      aria-checked={isDark}
                      onClick={() => setTheme("DARK")}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                <div className="jt-navbar-panel__section">
                  <label className="jt-navbar-panel__label" htmlFor="jt-currency-select">
                    Currency
                  </label>
                  <select
                    id="jt-currency-select"
                    className="jt-select"
                    value={currencyCode}
                    onChange={(e) => setCurrencyCode(e.target.value)}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {settingsLoading && <p className="jt-navbar-panel__note">Syncing settings…</p>}
                {settingsError && (
                  <p className="jt-navbar-panel__note jt-navbar-panel__note--error">{settingsError}</p>
                )}

                <Link className="jt-navbar-panel__link" to="/settings">
                  Full settings
                </Link>
                <button type="button" className="jt-navbar-panel__logout" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}