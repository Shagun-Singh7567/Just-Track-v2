import React, { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { authStorage } from "../api/authStorage";
import { authApi } from "../api/authApi"; // swap for your real client

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

const SETTINGS_STYLES = `
.jt-settings {
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

  min-height: 100vh;
  background: var(--jt-paper);
  color: var(--jt-ink);
  font-family: var(--jt-font-body);
  padding: 40px 24px 80px;
  transition: background 0.35s ease, color 0.35s ease;
}

.jt-settings.jt-dark {
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

.jt-settings__container {
  max-width: 640px;
  margin: 0 auto;
}

.jt-settings__title {
  font-family: var(--jt-font-display);
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 6px;
}

.jt-settings__subtitle {
  font-size: 14px;
  color: var(--jt-ink-soft);
  margin: 0 0 32px;
}

.jt-settings__card {
  background: var(--jt-paper-raised);
  border: 1px solid var(--jt-border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.jt-settings__card-title {
  font-family: var(--jt-font-display);
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 4px;
}

.jt-settings__card-desc {
  font-size: 13px;
  color: var(--jt-ink-soft);
  margin: 0 0 20px;
}

.jt-settings__field {
  margin-bottom: 16px;
}

.jt-settings__field:last-child {
  margin-bottom: 0;
}

.jt-settings__label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--jt-ink-soft);
  margin-bottom: 6px;
}

.jt-settings__input,
.jt-settings__select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--jt-border);
  border-radius: 8px;
  background: var(--jt-paper);
  color: var(--jt-ink);
  font-size: 14px;
  font-family: var(--jt-font-body);
  box-sizing: border-box;
}

.jt-settings__input:focus,
.jt-settings__select:focus {
  outline: none;
  border-color: var(--jt-gold);
}

.jt-settings__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 520px) {
  .jt-settings__row {
    grid-template-columns: 1fr;
  }
}

.jt-settings__segmented {
  display: inline-flex;
  border: 1px solid var(--jt-border);
  border-radius: 8px;
  overflow: hidden;
}

.jt-settings__segmented-option {
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--jt-ink-soft);
}

.jt-settings__segmented-option + .jt-settings__segmented-option {
  border-left: 1px solid var(--jt-border);
}

.jt-settings__segmented-option--active {
  background: var(--jt-sage);
  color: var(--jt-paper);
}

.jt-settings__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.jt-settings__save {
  padding: 9px 18px;
  border-radius: 8px;
  border: none;
  background: var(--jt-sage);
  color: var(--jt-paper);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}

.jt-settings__save:disabled {
  opacity: 0.6;
  cursor: default;
}

.jt-settings__save:hover:not(:disabled) {
  filter: brightness(1.05);
}

.jt-settings__status {
  font-size: 12.5px;
}

.jt-settings__status--success {
  color: var(--jt-sage);
}

.jt-settings__status--error {
  color: var(--jt-stamp);
}

.jt-settings__danger {
  border-color: rgba(166, 67, 45, 0.35);
}

.jt-settings__danger-btn {
  padding: 9px 18px;
  border-radius: 8px;
  border: 1px solid var(--jt-stamp);
  background: transparent;
  color: var(--jt-stamp);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
}

.jt-settings__danger-btn:hover {
  background: rgba(166, 67, 45, 0.08);
}
`;

export default function SettingsPage() {
  const { isDark, currencyCode, setTheme, setCurrencyCode } = useSettings();
  const user = authStorage.getUser();

  // --- Account details form state ---
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [accountStatus, setAccountStatus] = useState(null); // { type: 'success'|'error', message }
  const [accountSaving, setAccountSaving] = useState(false);

  // --- Password form state ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  async function handleAccountSave(e) {
    e.preventDefault();
    setAccountStatus(null);
    setAccountSaving(true);
    try {
      const updated = await authApi.updateProfile({ name, email });
      authStorage.setUser({ ...user, ...updated });
      setAccountStatus({ type: "success", message: "Account details saved." });
    } catch (err) {
      console.error(err);
      setAccountStatus({ type: "error", message: "Couldn't save changes. Try again." });
    } finally {
      setAccountSaving(false);
    }
  }

  async function handlePasswordSave(e) {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 8) {
      setPasswordStatus({ type: "error", message: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: "error", message: "New passwords don't match." });
      return;
    }

    setPasswordSaving(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setPasswordStatus({ type: "success", message: "Password updated." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setPasswordStatus({ type: "error", message: "Couldn't update password. Check your current password and try again." });
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <>
      <style>{SETTINGS_STYLES}</style>
      <div className={isDark ? "jt-settings jt-dark" : "jt-settings jt-light"}>
        <div className="jt-settings__container">
          <h1 className="jt-settings__title">Settings</h1>
          <p className="jt-settings__subtitle">Manage your account details and preferences.</p>

          {/* Account details */}
          <form className="jt-settings__card" onSubmit={handleAccountSave}>
            <h2 className="jt-settings__card-title">Account details</h2>
            <p className="jt-settings__card-desc">Your name and email as they appear across Just Track.</p>

            <div className="jt-settings__row">
              <div className="jt-settings__field">
                <label className="jt-settings__label" htmlFor="jt-name">Name</label>
                <input
                  id="jt-name"
                  className="jt-settings__input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div className="jt-settings__field">
                <label className="jt-settings__label" htmlFor="jt-email">Email</label>
                <input
                  id="jt-email"
                  className="jt-settings__input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="jt-settings__actions">
              <button type="submit" className="jt-settings__save" disabled={accountSaving}>
                {accountSaving ? "Saving…" : "Save changes"}
              </button>
              {accountStatus && (
                <span className={`jt-settings__status jt-settings__status--${accountStatus.type}`}>
                  {accountStatus.message}
                </span>
              )}
            </div>
          </form>

          {/* Password */}
          <form className="jt-settings__card" onSubmit={handlePasswordSave}>
            <h2 className="jt-settings__card-title">Password</h2>
            <p className="jt-settings__card-desc">Choose a new password with at least 8 characters.</p>

            <div className="jt-settings__field">
              <label className="jt-settings__label" htmlFor="jt-current-password">Current password</label>
              <input
                id="jt-current-password"
                className="jt-settings__input"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="jt-settings__row">
              <div className="jt-settings__field">
                <label className="jt-settings__label" htmlFor="jt-new-password">New password</label>
                <input
                  id="jt-new-password"
                  className="jt-settings__input"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="jt-settings__field">
                <label className="jt-settings__label" htmlFor="jt-confirm-password">Confirm password</label>
                <input
                  id="jt-confirm-password"
                  className="jt-settings__input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="jt-settings__actions">
              <button type="submit" className="jt-settings__save" disabled={passwordSaving}>
                {passwordSaving ? "Updating…" : "Update password"}
              </button>
              {passwordStatus && (
                <span className={`jt-settings__status jt-settings__status--${passwordStatus.type}`}>
                  {passwordStatus.message}
                </span>
              )}
            </div>
          </form>

          {/* Preferences */}
          <div className="jt-settings__card">
            <h2 className="jt-settings__card-title">Preferences</h2>
            <p className="jt-settings__card-desc">Theme and currency, synced across your devices.</p>

            <div className="jt-settings__field">
              <span className="jt-settings__label">Theme</span>
              <div className="jt-settings__segmented" role="radiogroup" aria-label="Theme">
                <button
                  type="button"
                  className={`jt-settings__segmented-option${!isDark ? " jt-settings__segmented-option--active" : ""}`}
                  role="radio"
                  aria-checked={!isDark}
                  onClick={() => setTheme("LIGHT")}
                >
                  Light
                </button>
                <button
                  type="button"
                  className={`jt-settings__segmented-option${isDark ? " jt-settings__segmented-option--active" : ""}`}
                  role="radio"
                  aria-checked={isDark}
                  onClick={() => setTheme("DARK")}
                >
                  Dark
                </button>
              </div>
            </div>

            <div className="jt-settings__field">
              <label className="jt-settings__label" htmlFor="jt-settings-currency">Currency</label>
              <select
                id="jt-settings-currency"
                className="jt-settings__select"
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
          </div>
        </div>
      </div>
    </>
  );
}