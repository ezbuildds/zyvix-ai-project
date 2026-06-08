import { useState } from "react";
import styles from "./transactionHistory.module.css";
import { authData } from "../../Context/ContextApi";
import Sidebar from "../Pages/Sidebar";

// ── Helpers ─────────────────────────────────────────────────────────────────
const PLAN_META = {
  lite: { label: "Lite", icon: "⚡", colorClass: "lite" },
  plus: { label: "Plus", icon: "🚀", colorClass: "plus" },
  enterprise: { label: "Enterprise", icon: "🏢", colorClass: "ent" },
};

const STATUS_META = {
  success: { label: "Success", colorClass: "success" },
  failed: { label: "Failed", colorClass: "failed" },
  pending: { label: "Pending", colorClass: "pending" },
};

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).format(date);
}

function formatAmount(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: currency.toUpperCase(),
  }).format(amount);
}

// ── Single transaction card ──────────────────────────────────────────────────
function TxnCard({ txn }) {
  const plan = PLAN_META[txn.plan] || { label: txn.plan, icon: "💳", colorClass: "lite" };
  const status = STATUS_META[txn.status] || { label: txn.status, colorClass: "pending" };

  return (
    <div className={styles.card}>
      {/* Middle info */}
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          {/* <span className={styles.cardTitle}>
            {plan.label} plan
          </span> */}
          <span className={`${styles.planTag} ${styles[`tag_${plan.colorClass}`]}`}>
            {txn.plan}
          </span>
        </div>

        <div className={styles.cardMeta}>
          <span>{formatDate(new Date(txn.createdAt))}</span>
          <span className={styles.metaDot}>·</span>
          <span style={{ textTransform: "capitalize" }}>{txn.billing}</span>
          <span className={styles.metaDot}>·</span>
          <span>{txn.currency.toUpperCase()}</span>
        </div>

        <div className={styles.creditsPill}>
          ✦ {txn.credits.toLocaleString()} credits
          {txn.status === "failed" && <span className={styles.creditsNote}> — not issued</span>}
          {txn.status === "pending" && <span className={styles.creditsNote}> — processing</span>}
        </div>
      </div>

      {/* Right amount + status */}
      <div className={styles.cardRight}>
        <span className={`${styles.amount} ${txn.status === "failed" ? styles.amountFailed : ""}`}>
          {formatAmount(txn.amount, txn.currency)}
        </span>
        <span className={`${styles.badge} ${styles[`badge_${status.colorClass}`]}`}>
          <span className={`${styles.dot} ${styles[`dot_${status.colorClass}`]}`} />
          {status.label}
        </span>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function TransactionHistory() {
  const { user } = authData()
  return (
    <div className={styles.dbRoot}>
      <Sidebar />
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.heading}>Transaction history</h2>
            <p className={styles.subheading}>Your billing & payment records</p>
          </div>
        </div>

        {/* Cards */}
        <div className={styles.list}>
          {user.transactions.length === 0 ? (
            <div className={styles.empty}>
              <span>No  transactions found.</span>
            </div>
          ) : (
            user.transactions.map(txn => <TxnCard key={txn._id} txn={txn} />)
          )}
        </div>
      </div>
    </div>
  );
}