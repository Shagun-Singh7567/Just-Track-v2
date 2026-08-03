import React, { useEffect, useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { authStorage } from "../api/authStorage";
import { notificationsApi } from "../api/notificationsApi";
import "./Navbar.css";

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
];

// Shown only if GET /notifications fails (route doesn't exist yet).
const SAMPLE_NOTIFICATIONS = [
  { id: "s1", title: "Budget alert", body: "You've used 85% of your Dining budget this month.", time: "2h ago", read: false },
  { id: "s2", title: "Large transaction", body: "A transaction was recorded above your usual range.", time: "1d ago", read: false },
  { id: "s3", title: "Weekly summary ready", body: "Your spending summary for last week is ready.", time: "3d ago", read: true },
];

export default function Navbar({ onLogout, links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transactions", href: "/transactions" },
  { label: "Reports", href: "/reports" },
] }) {
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifNote, setNotifNote] = useState(null);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  <style>
    {
      ```
      /*
  Tokens below assume the project's existing ink/paper/sage/gold palette.
  If these already live in a shared tokens file, delete this block and
  point --jt-* at the shared variables instead.
*/
.jt-navbar {
  --jt-ink: #14201d;
  --jt-ink-soft: rgba(20, 32, 29, 0.62);
  --jt-paper: #f4efe4;
  --jt-paper-raised: #fbf8f1;
  --jt-sage: #5c7a6c;
  --jt-sage-soft: #e2e8e0;
  --jt-gold: #b8923d;
  --jt-stamp: #a6432d; /* used only for the unread mark, like a postmark ink */
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

.jt-navbar__links {
  display: flex;
  gap: 24px;
  flex: 1;
}

.jt-navbar__link {
  font-size: 14px;
  color: var(--jt-ink-soft);
  text-decoration: none;
  padding: 4px 2px;
  border-bottom: 1px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.jt-navbar__link:hover,
.jt-navbar__link:focus-visible {
  color: var(--jt-ink);
  border-bottom-color: var(--jt-gold);
}

.jt-navbar__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* --- Shared icon / avatar buttons --- */

.jt-icon-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid transparent;
  background: transparent;
  color: var(--jt-ink);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.jt-icon-btn:hover,
.jt-icon-btn:focus-visible {
  background: var(--jt-sage-soft);
  border-color: var(--jt-border);
}

.jt-icon-btn:focus-visible {
  outline: 2px solid var(--jt-gold);
  outline-offset: 2px;
}

.jt-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--jt-stamp);
  color: var(--jt-paper);
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
}

/* Avatar reads like a wax-seal stamp: a plain ring that only becomes a
   full seal (dashed ring) on hover/focus, echoing the ledger motif. */
.jt-avatar-btn {
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
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* --- Dropdown shell --- */

.jt-dropdown {
  position: relative;
}

.jt-panel {
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

.jt-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--jt-gold);
}

.jt-panel__note {
  font-size: 12px;
  color: var(--jt-ink-soft);
  margin: 0 0 10px;
}

.jt-panel__note--error {
  color: var(--jt-stamp);
}

.jt-panel__empty {
  font-size: 13px;
  color: var(--jt-ink-soft);
  text-align: center;
  padding: 18px 0;
  margin: 0;
}

.jt-link-btn {
  background: none;
  border: none;
  color: var(--jt-sage);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.jt-link-btn:hover {
  color: var(--jt-ink);
}

/* --- Notifications --- */

.jt-notif-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.jt-notif-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 8px;
  border-radius: 6px;
  cursor: pointer;
}

.jt-notif-item:hover {
  background: var(--jt-sage-soft);
}

.jt-notif-item--unread {
  position: relative;
  padding-left: 16px;
}

.jt-notif-item--unread::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 13px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--jt-stamp);
}

.jt-notif-item__title {
  font-size: 13px;
  font-weight: 600;
}

.jt-notif-item__body {
  font-size: 12px;
  color: var(--jt-ink-soft);
}

.jt-notif-item__time {
  font-size: 11px;
  color: var(--jt-ink-soft);
  opacity: 0.8;
}

/* --- Profile panel --- */

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
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.jt-panel__section {
  margin-bottom: 12px;
}

.jt-panel__label {
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

.jt-panel__link {
  display: block;
  font-size: 12.5px;
  color: var(--jt-sage);
  text-decoration: none;
  padding: 8px 0 4px;
  border-top: 1px solid var(--jt-border);
  margin-top: 4px;
}

.jt-panel__link:hover {
  color: var(--jt-ink);
}

.jt-panel__logout {
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

.jt-panel__logout:hover {
  background: rgba(166, 67, 45, 0.08);
}

/* --- Responsive --- */

@media (max-width: 720px) {
  .jt-navbar__links {
    display: none;
  }

  .jt-panel {
    width: 88vw;
    right: -12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .jt-navbar__link,
  .jt-icon-btn,
  .jt-avatar-btn,
  .jt-avatar-upload__edit,
  .jt-segmented__option,
  .jt-panel__logout {
    transition: none;
  }
}
      ```
    }
    </style>
  // Close whichever dropdown is open on outside click.
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape for keyboard users.
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setNotifLoading(true);
        const res = await notificationsApi.list();
        if (!mounted) return;
        setNotifications(res.data);
        setNotifNote(null);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setNotifications(SAMPLE_NOTIFICATIONS);
        setNotifNote("Showing sample alerts — live notifications aren't connected yet.");
      } finally {
        if (mounted) setNotifLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAsRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await notificationsApi.markRead(id);
    } catch (err) {
      console.error(err);
      // Real endpoint doesn't exist yet — leave the optimistic state as-is
      // rather than reverting, so the demo still feels usable.
    }
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationsApi.markAllRead();
    } catch (err) {
      console.error(err);
    }
  }

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
    <nav className="jt-navbar">
      <div className="jt-navbar__brand">
        <span className="jt-navbar__mark">JT</span>
        <span className="jt-navbar__name">Just Track</span>
      </div>

      <div className="jt-navbar__links">
        {links.map((link) => (
          <a key={link.href} className="jt-navbar__link" href={link.href}>
            {link.label}
          </a>
        ))}
      </div>

      <div className="jt-navbar__actions">
        {/* Notifications */}
        <div className="jt-dropdown" ref={notifRef}>
          <button
            type="button"
            className="jt-icon-btn"
            aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
            aria-expanded={notifOpen}
            onClick={() => {
              setNotifOpen((o) => !o);
              setProfileOpen(false);
            }}
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="jt-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="jt-panel jt-panel--notif" role="menu">
              <div className="jt-panel__header">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button type="button" className="jt-link-btn" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              {notifNote && <p className="jt-panel__note">{notifNote}</p>}

              {notifLoading ? (
                <p className="jt-panel__empty">Loading…</p>
              ) : notifications.length === 0 ? (
                <p className="jt-panel__empty">You're all caught up.</p>
              ) : (
                <ul className="jt-notif-list">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`jt-notif-item${n.read ? "" : " jt-notif-item--unread"}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <span className="jt-notif-item__title">{n.title}</span>
                      <span className="jt-notif-item__body">{n.body}</span>
                      <span className="jt-notif-item__time">{n.time}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="jt-dropdown" ref={profileRef}>
          <button
            type="button"
            className="jt-avatar-btn"
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotifOpen(false);
            }}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="" className="jt-avatar-btn__img" />
            ) : (
              <span className="jt-avatar-btn__initials">{initials}</span>
            )}
          </button>

          {profileOpen && (
            <div className="jt-panel jt-panel--profile" role="menu">
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
                <p className="jt-panel__note">
                  Preview only — picture uploads aren't saved yet.
                </p>
              )}

              <div className="jt-panel__section">
                <span className="jt-panel__label">Theme</span>
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

              <div className="jt-panel__section">
                <label className="jt-panel__label" htmlFor="jt-currency-select">
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

              {settingsLoading && <p className="jt-panel__note">Syncing settings…</p>}
              {settingsError && (
                <p className="jt-panel__note jt-panel__note--error">{settingsError}</p>
              )}

              <a className="jt-panel__link" href="/settings">
                Full settings
              </a>
              <button type="button" className="jt-panel__logout" onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function BellIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
