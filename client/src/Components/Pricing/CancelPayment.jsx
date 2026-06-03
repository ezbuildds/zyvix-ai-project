import styles from "./CancelPayment.module.css";

export default function CancelPaymentPopup({
  planName        = "Plus",
  billing         = "monthly",
  amount          = "$89",
  onClose         = () => {},
  onRetryPayment  = () => {},
  onViewPlans     = () => {},
}) {
  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.popup} role="dialog" aria-modal="true" aria-labelledby="cancel-title">

        {/* Close */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>

        {/* Icon */}
        <div className={styles.iconCircle}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M10 10l12 12M22 10L10 22" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Heading */}
        <p className={styles.subtitle}>Payment cancelled</p>
        <h1 className={styles.title} id="cancel-title">No charge was made</h1>
        <p className={styles.desc}>
          Your payment for the <strong>{planName}</strong> plan was cancelled. Don't worry — you haven't been charged anything.
        </p>

        {/* Info card */}
        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <div className={styles.infoIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
              </svg>
            </div>
            <p className={styles.infoText}>
              Your <strong>{planName} ({billing})</strong> subscription was not activated. You can retry anytime.
            </p>
          </div>
        </div>

        {/* What was cancelled */}
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
            <span className={styles.receiptLabel}>Amount</span>
            <span className={styles.receiptStrike}>{amount}</span>
            <span className={styles.receiptFree}>Not charged</span>
          </div>
        </div>

        {/* Buttons */}
        <button className={styles.primaryBtn} onClick={onRetryPayment}>
          Try again →
        </button>
        <button className={styles.ghostBtn} onClick={onViewPlans}>
          View all plans
        </button>

        {/* Footer */}
        <p className={styles.footerNote}>
          🔒 Secured by Stripe &nbsp;·&nbsp; Need help? <a href="mailto:support@example.com" className={styles.footerLink}>Contact support</a>
        </p>

      </div>
    </div>
  );
}