import { Link } from "react-router-dom";
import styles from "./SuccessPayment.module.css";

export default function SuccessPaymentPopup({
  planName = "Plus",
  billing = "monthly",
  amount = "$89",
  email = "user@example.com",
  renewalDate = "July 3, 2026",
  onClose = () => { },
  onGoToDashboard = () => { },
}) {
  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.popup} role="dialog" aria-modal="true" aria-labelledby="success-title">

        {/* Close */}
        {/* <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button> */}

        {/* Success icon */}
        <div className={styles.iconCircle}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M7 16l6 6 12-12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Heading */}
        <p className={styles.subtitle}>Payment successful</p>
        <h1 className={styles.title} id="success-title">You're all set! 🎉</h1>
        <p className={styles.desc}>
          Your <strong>{planName}</strong> plan is now active. A confirmation has been sent to <strong>{email}</strong>.
        </p>

        {/* Receipt card */}
        <div className={styles.receipt}>
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Plan</span>
            <span className={styles.receiptValue}>{planName}</span>
          </div>
          <div className={styles.receiptDivider} />
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Billing</span>
            <span className={styles.receiptValue} style={{ textTransform: "capitalize" }}>{billing}</span>
          </div>
          <div className={styles.receiptDivider} />
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Amount charged</span>
            <span className={styles.receiptValueBold}>{amount}</span>
          </div>
          <div className={styles.receiptDivider} />
          <div className={styles.receiptRow}>
            <span className={styles.receiptLabel}>Next renewal</span>
            <span className={styles.receiptValue}>{renewalDate}</span>
          </div>
        </div>

        {/* CTA buttons */}
        <Link to={"/dashboard"} ><button className={styles.primaryBtn} onClick={onGoToDashboard}>
          Go to dashboard →
        </button></Link>
        {/* <button className={styles.ghostBtn} onClick={onClose}>
          Maybe later
        </button> */}

        {/* Footer */}
        <p className={styles.footerNote}>
          <span className={styles.lockIcon}>🔒</span>
          Secured by Stripe &nbsp;·&nbsp; Cancel anytime from settings
        </p>

      </div>
    </div>
  );
}