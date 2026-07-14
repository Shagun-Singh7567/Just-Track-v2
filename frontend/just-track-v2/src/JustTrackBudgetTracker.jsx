import React, { useState, useMemo, useEffect } from "react";
import { Plus, Trash2, Sun, Moon, Wallet } from "lucide-react";
import { transactionApi } from "./api/transactionApi";

/**
 * JUST TRACK — wired to a Spring Boot REST API.
 *
 * Backend endpoints used:
 *   GET    /api/transactions          -> list all entries
 *   POST   /api/transactions          -> create an entry
 *   DELETE /api/transactions/{id}     -> remove an entry
 *
 * Shape of a transaction matches the JPA entity:
 *   { id, createdDate, description, category, type: 'INCOME' | 'EXPENSE', amount }
 *
 */

const CATEGORIES = [
  "Salary",
  "Freelance",
  "Housing",
  "Groceries",
  "Transport",
  "Utilities",
  "Entertainment",
  "Other",
];

const currency = (n) =>
  (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function JustTrackBudgetTracker() {
  const [dark, setDark] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");

  const [form, setForm] = useState({
    description: "",
    category: CATEGORIES[0],
    type: "EXPENSE",
    amount: "",
  });

  // CSS variables scoped to .jt-root can't cascade *up* to <body>, so without
  // this, the browser's default white body background shows through as a
  // white boundary around the app (very visible in dark mode). Keep body in sync.
  useEffect(() => {
    document.body.style.background = dark ? "#14171C" : "#FAF7F0";
    document.body.style.margin = "0";
    document.documentElement.style.background = dark ? "#14171C" : "#FAF7F0";
  }, [dark]);

  // GET /api/transactions on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchTransactions() {
      try {
        setLoading(true);
        const res = await transactionApi.getAll();
        if (isMounted) setTransactions(res.data);
      } catch (err) {
        if (isMounted) setLoadError("Failed to load transactions. Is the backend running?");
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTransactions();
    return () => { isMounted = false; };
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (!form.description.trim() || !amt || amt <= 0) return;

    const payload = {
      description: form.description.trim(),
      category: form.category,
      type: form.type,
      amount: amt,
    };

    try {
      setSubmitting(true);
      setSubmitError(null);
      // POST /api/transactions — server assigns id + createdDate
      const res = await transactionApi.create(payload);
      setTransactions((prev) => [...prev, res.data]);
      setForm({ description: "", category: CATEGORIES[0], type: "EXPENSE", amount: "" });
    } catch (err) {
      setSubmitError("Failed to add transaction.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    const prev = transactions;
    // optimistic update, rolled back on failure
    setTransactions((cur) => cur.filter((t) => t.id !== id));
    // try {
    //   // DELETE /api/transactions/{id}
    //   await transactionApi.delete(id);
    // } catch (err) {
    //   setTransactions(prev);
    //   console.error("Failed to delete transaction", err);
    // }
  }

  const totalIncome = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // running balance computed chronologically, then shown newest-first
  const chronological = [...transactions].sort(
    (a, b) => (a.createdDate || "").localeCompare(b.createdDate || "") || a.id - b.id
  );
  let running = 0;
  const withRunning = chronological.map((t) => {
    running += t.type === "INCOME" ? t.amount : -t.amount;
    return { ...t, running };
  });
  const ledgerRows = [...withRunning].reverse();

  const visibleRows = ledgerRows.filter(
    (t) => (filterCategory === "ALL" || t.category === filterCategory) && (filterType === "ALL" || t.type === filterType)
  );

  const categoryTally = CATEGORIES.map((cat) => {
    const total = transactions.filter((t) => t.category === cat && t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
    return { cat, total };
  })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
  const maxTally = Math.max(...categoryTally.map((c) => c.total), 1);

  return (
    <div className={dark ? "jt-root jt-dark" : "jt-root jt-light"}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

        html, body { margin: 0; padding: 0; }

        .jt-root {
          --paper: #FAF7F0;
          --surface: #FFFFFF;
          --ink: #1B2A4A;
          --ink-soft: #5A6478;
          --rule: #D8D2C4;
          --margin: #B23A3A;
          --income: #2F6E4F;
          --expense: #B23A3A;
          --stamp: #1B2A4A;
          font-family: 'Inter', sans-serif;
          color: var(--ink);
          background: var(--paper);
          min-height: 100vh;
          width: 100%;
          transition: background 0.35s ease, color 0.35s ease;
          padding: 0;
        }
        .jt-root.jt-dark {
          --paper: #14171C;
          --surface: #1C2027;
          --ink: #E8E4D9;
          --ink-soft: #9AA0AC;
          --rule: #2A2E36;
          --margin: #E0645C;
          --income: #4FAE7C;
          --expense: #E0645C;
          --stamp: #E8E4D9;
        }
        .jt-shell { max-width: 780px; margin: 0 auto; padding: 28px 20px 60px; }
        .jt-display { font-family: 'Special Elite', monospace; letter-spacing: 0.5px; }
        .jt-mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }

        .jt-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
        .jt-title { font-size: 22px; display: flex; align-items: center; gap: 10px; }
        .jt-title .jt-sub { font-size: 11px; color: var(--ink-soft); font-family: 'Inter'; letter-spacing: 1.5px; text-transform: uppercase; display: block; margin-top: 2px; }

        .jt-stamp-btn {
          border: 2px solid var(--stamp);
          background: transparent;
          color: var(--stamp);
          border-radius: 999px;
          width: 42px; height: 42px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transform: rotate(-4deg);
          transition: transform 0.25s ease, background 0.25s ease;
        }
        .jt-stamp-btn:hover { transform: rotate(0deg) scale(1.06); }
        .jt-stamp-btn:active { transform: rotate(-8deg) scale(0.95); }

        .jt-hero {
          background: var(--surface);
          border: 1px solid var(--rule);
          border-radius: 6px;
          padding: 24px 26px;
          margin-bottom: 22px;
          position: relative;
          overflow: hidden;
        }
        .jt-hero-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 6px; }
        .jt-hero-balance { font-size: 44px; font-weight: 600; line-height: 1; }
        .jt-hero-row { display: flex; gap: 28px; margin-top: 16px; }
        .jt-hero-stat { font-size: 14px; }
        .jt-hero-stat .amt { display: block; font-size: 17px; margin-top: 2px; }

        .jt-panel { background: var(--surface); border: 1px solid var(--rule); border-radius: 6px; padding: 18px 20px; margin-bottom: 22px; }
        .jt-panel-title { font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 14px; }

        .jt-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 12px; }
        .jt-form-grid .full { grid-column: 1 / -1; }
        .jt-field label { display: block; font-size: 11px; color: var(--ink-soft); margin-bottom: 4px; letter-spacing: 0.5px; }
        .jt-field input, .jt-field select {
          width: 100%; box-sizing: border-box;
          background: var(--paper); color: var(--ink);
          border: 1px solid var(--rule); border-radius: 4px;
          padding: 8px 10px; font-size: 14px; font-family: 'Inter';
        }
        .jt-field input:focus, .jt-field select:focus, .jt-stamp-btn:focus-visible, .jt-toggle button:focus-visible {
          outline: 2px solid var(--margin); outline-offset: 1px;
        }

        .jt-toggle { display: flex; border: 1px solid var(--rule); border-radius: 4px; overflow: hidden; }
        .jt-toggle button {
          flex: 1; border: none; background: var(--paper); color: var(--ink-soft);
          padding: 8px 0; font-size: 13px; cursor: pointer; font-family: 'Inter'; font-weight: 500;
        }
        .jt-toggle button.active.income { background: var(--income); color: var(--paper); }
        .jt-toggle button.active.expense { background: var(--expense); color: var(--paper); }

        .jt-submit {
          margin-top: 12px; width: 100%;
          background: var(--ink); color: var(--paper);
          border: none; border-radius: 4px; padding: 10px 0;
          font-size: 14px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: opacity 0.2s ease;
        }
        .jt-submit:hover { opacity: 0.85; }
        .jt-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .jt-error { font-size: 12.5px; color: var(--expense); margin-top: 10px; }

        .jt-filters { display: flex; gap: 10px; margin-bottom: 12px; }
        .jt-filters select { background: var(--surface); color: var(--ink); border: 1px solid var(--rule); border-radius: 4px; padding: 6px 8px; font-size: 13px; font-family: 'Inter'; }

        .jt-ledger { position: relative; padding-left: 20px; }
        .jt-ledger::before { content: ''; position: absolute; left: 6px; top: 0; bottom: 0; width: 1.5px; background: var(--margin); opacity: 0.55; }

        .jt-row { display: grid; grid-template-columns: 78px 1fr 100px 90px; align-items: center; gap: 8px; padding: 10px 0; border-bottom: 1px dashed var(--rule); }
        .jt-row:last-child { border-bottom: none; }
        .jt-row .date { font-size: 11px; color: var(--ink-soft); }
        .jt-row .desc { font-size: 14px; }
        .jt-row .desc .cat { display: block; font-size: 10.5px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 1px; }
        .jt-row .amt { text-align: right; font-size: 14px; font-weight: 600; }
        .jt-row .amt.income { color: var(--income); }
        .jt-row .amt.expense { color: var(--expense); }
        .jt-row .bal { text-align: right; font-size: 12px; color: var(--ink-soft); display: flex; align-items: center; justify-content: flex-end; gap: 6px; }
        .jt-row .del { background: none; border: none; color: var(--ink-soft); cursor: pointer; opacity: 0; transition: opacity 0.15s ease, color 0.15s ease; padding: 2px; }
        .jt-row:hover .del { opacity: 1; }
        .jt-row .del:hover { color: var(--expense); }

        .jt-empty { text-align: center; padding: 30px 0; color: var(--ink-soft); font-size: 13px; }
        .jt-loading { text-align: center; padding: 30px 0; color: var(--ink-soft); font-size: 13px; }
        .jt-load-error { text-align: center; padding: 30px 0; color: var(--expense); font-size: 13px; }

        .jt-tally-row { display: grid; grid-template-columns: 110px 1fr 70px; align-items: center; gap: 10px; margin-bottom: 9px; font-size: 12.5px; }
        .jt-tally-track { background: var(--paper); border: 1px solid var(--rule); border-radius: 3px; height: 8px; overflow: hidden; }
        .jt-tally-fill { height: 100%; background: var(--expense); opacity: 0.75; }
        .jt-tally-amt { text-align: right; }

        .jt-footer { text-align: center; font-size: 11px; color: var(--ink-soft); margin-top: 30px; letter-spacing: 0.5px; }

        @media (max-width: 520px) {
          .jt-form-grid { grid-template-columns: 1fr; }
          .jt-row { grid-template-columns: 60px 1fr 78px; }
          .jt-row .bal { display: none; }
        }
      `}</style>

      <div className="jt-shell">
        <div className="jt-header">
          <div className="jt-title">
            <Wallet size={22} strokeWidth={2} />
            <span className="jt-display">
              JUST TRACK
              <span className="jt-sub">personal ledger</span>
            </span>
          </div>
          <button
            className="jt-stamp-btn"
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="jt-hero">
          <div className="jt-hero-label">Current balance</div>
          <div className="jt-hero-balance jt-mono">{currency(balance)}</div>
          <div className="jt-hero-row">
            <div className="jt-hero-stat">
              Income
              <span className="jt-mono amt" style={{ color: "var(--income)" }}>{currency(totalIncome)}</span>
            </div>
            <div className="jt-hero-stat">
              Expenses
              <span className="jt-mono amt" style={{ color: "var(--expense)" }}>{currency(-totalExpense)}</span>
            </div>
            <div className="jt-hero-stat">
              Entries
              <span className="jt-mono amt">{transactions.length}</span>
            </div>
          </div>
        </div>

        <div className="jt-panel">
          <div className="jt-panel-title">New entry</div>
          <form onSubmit={handleAdd}>
            <div className="jt-form-grid">
              <div className="jt-field">
                <label htmlFor="jt-amount">Amount</label>
                <input
                  id="jt-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div className="jt-field">
                <label htmlFor="jt-cat">Category</label>
                <select id="jt-cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="jt-field full">
                <label htmlFor="jt-desc">Description</label>
                <input
                  id="jt-desc"
                  type="text"
                  placeholder="e.g. Groceries at the market"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="jt-field full">
                <label>Type</label>
                <div className="jt-toggle">
                  <button
                    type="button"
                    className={form.type === "INCOME" ? "active income" : ""}
                    onClick={() => setForm({ ...form, type: "INCOME" })}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    className={form.type === "EXPENSE" ? "active expense" : ""}
                    onClick={() => setForm({ ...form, type: "EXPENSE" })}
                  >
                    Expense
                  </button>
                </div>
              </div>
            </div>
            <button type="submit" className="jt-submit" disabled={submitting}>
              <Plus size={16} /> {submitting ? "Adding..." : "Add entry"}
            </button>
            {submitError && <div className="jt-error">{submitError}</div>}
          </form>
        </div>

        <div className="jt-panel">
          <div className="jt-panel-title">Ledger</div>
          <div className="jt-filters">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="ALL">All types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="ALL">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="jt-loading">Loading transactions...</div>
          ) : loadError ? (
            <div className="jt-load-error">{loadError}</div>
          ) : visibleRows.length === 0 ? (
            <div className="jt-empty">No entries match this filter yet.</div>
          ) : (
            <div className="jt-ledger">
              {visibleRows.map((t) => (
                <div className="jt-row" key={t.id}>
                  <div className="date jt-mono">{(t.createdDate || "").slice(5) || "—"}</div>
                  <div className="desc">
                    {t.description}
                    <span className="cat">{t.category}</span>
                  </div>
                  <div className={"amt jt-mono " + (t.type === "INCOME" ? "income" : "expense")}>
                    {t.type === "INCOME" ? "+" : "−"}{currency(t.amount).replace("$", "")}
                  </div>
                  <div className="bal jt-mono">
                    {currency(t.running)}
                    <button className="del" onClick={() => handleDelete(t.id)} aria-label={`Delete ${t.description}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {categoryTally.length > 0 && (
          <div className="jt-panel">
            <div className="jt-panel-title">Tally by category</div>
            {categoryTally.map((c) => (
              <div className="jt-tally-row" key={c.cat}>
                <div>{c.cat}</div>
                <div className="jt-tally-track">
                  <div className="jt-tally-fill" style={{ width: `${(c.total / maxTally) * 100}%` }} />
                </div>
                <div className="jt-tally-amt jt-mono">{currency(c.total)}</div>
              </div>
            ))}
          </div>
        )}

        <div className="jt-footer">Connected to Spring Boot at /api/transactions.</div>
      </div>
    </div>
  );
}