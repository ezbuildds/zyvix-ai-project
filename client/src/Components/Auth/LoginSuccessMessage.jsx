import React from "react";
import styles from "./loginsuccessmessage.module.css";

const LoginSuccessMessage = ({ showLoginMessage, showResetMessage, showSuccessMessage }) => {
    return (
        <>
            {/* <style>{css}</style> */}
            <div className={styles.modalOverlay}>
                <div className={styles.pageShell}>
                    <div className={`${styles.blob} ${styles.blob1}`} /><div className={`${styles.blob} ${styles.blob2}`} /><div className={`${styles.blob} ${styles.blob3}`} />
                    <div className={styles.signupCard}>
                        <div className={styles.cardStrip} />
                        <div className={styles.successState}>
                            <div className={styles.successIcon}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            {showLoginMessage && <><div className={styles.successTitle}>Login success! </div>
                                <div className={styles.successSub}>Welcome to Zyvix.ai! Your account is ready</div></>}
                            {showResetMessage && <><div className={styles.successTitle}>Reset successfull </div>
                                <div className={styles.successSub}>Your password has been reset successfully. You can now sign in using your new password.</div></>}
                            {/* <div className={styles.successEmail}>{form.email}</div> */}
                            {/* <button className={styles.submitBtn} style={{ marginTop: 8 }}>
                                Go to Dashboard →
                            </button> */}
                            {showSuccessMessage && <> <div className={styles.successTitle}>Account  Created! </div>
                                <div className={styles.successSub}>Welcome to Zyvix.ai! Your account is ready</div></>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginSuccessMessage;