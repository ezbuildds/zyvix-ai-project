import { useState } from "react";
import { authData } from "../../Context/ContextApi";
import styles from "../../css/ManageAccount.module.css"
export default function BillingTab({setPlanPopUp}) {
  const { user } = authData()
  return (
    <>
      <div className={styles.sectionRow}>
        <div className={styles.sectionLabel}>Current plan</div>

        <div className={styles.sectionValue}>
          <div className={styles.planCard}>
            <div className={styles.planName}>Current plan</div>
            <div className={styles.planTier}>{user.plan}</div>
            <div className={styles.planDesc}>
              {user.totalLimit} creations / month
            </div>

            <button className={styles.upgradeBtn} onClick={()=>{setPlanPopUp(true)}}>
              ✨ Upgrade to Pro
            </button>
          </div>
        </div>
      </div>

      <div className={styles.sectionRow}>
        <div className={styles.sectionLabel}>Usage</div>

        <div className={styles.sectionValue} style={{ gap: 8 }}>
          {[
            ["Articles written", "0 / 5"],
            ["Images generated", "0 / 5"],
            ["Titles generated", "0 / 20"],
          ].map(([k, v]) => (
            <div className={styles.billingRow} key={k}>
              <span className={styles.billingLabel}>{k}</span>
              <span className={styles.billingVal}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sectionRow}>
        <div className={styles.sectionLabel}>Payment method</div>

        <div className={styles.sectionValue}>
          <button className={styles.addBtn}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add payment method
          </button>
        </div>
      </div>
    </>
  );
}