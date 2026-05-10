
import { useState,memo } from "react";
import styles from "./forgot.module.css";
import OtpVerification from "./OtpVerification";
import ForgotOtpModel from "./ForgotOtpModel";

function Forgot({ setForgotModel, showProfileForgotModel, closeProfileForgotModel }) {
    const [showResetModel, setResetModel] = useState(false)
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const submit = async () => {
        if (!email.trim()) return setError("Email address is required");
        if (!/\S+@\S+\.\S+/.test(email)) return setError("Enter a valid email address");
        setError("");
        setLoading(true);
        try {
            let res = await fetch(`${BASE_URL}/api/auth/password/forgot`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: email })
            })
            res = await res.json()
            if (!res.success) {
                setError(res.message)
                return
            }
            setResetModel(true)
        } catch (error) {
            console.log(error)
            setError(error)
        } finally {
            setLoading(false)
        }

    };
    return (
        <div className={styles.modalOverlay} style={{ background: showProfileForgotModel ? "none" : "rgba(15, 23, 42, 0.45)" }}>
            {!showResetModel && <div className={styles.modalBox}>
                <div className={styles.cardHeader}>
                    <div className={styles.headerIconWrap}>
                        <div className={styles.iconPulse} />
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </div>

                    {showProfileForgotModel ? <button className={styles.closeBtn} onClick={() => { closeProfileForgotModel(false) }}>✕ </button>
                        : <button className={styles.closeBtn} onClick={() => { setForgotModel(false) }}>✕ </button>}

                    <div className={styles.headerTitle}>Forgot your <span>password?</span></div>

                    <div className={styles.headerSub}>
                        No worries! Enter your registered email and we'll send you a secure reset code.
                    </div>
                </div>

                <div className={styles.cardBody}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Registered Email</label>

                        <div className={styles.inputWrap}>
                            <span className={styles.inputIcon}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </span>

                            <input
                                className={`${styles.fieldInput} ${error
                                    ? styles.hasError
                                    : email && /\S+@\S+\.\S+/.test(email)
                                        ? styles.hasSuccess
                                        : ""
                                    }`}
                                placeholder="your@email.com"
                                type="email"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setError(""); }}
                                onKeyDown={e => e.key === "Enter" && submit()}
                            />
                        </div>

                        {error && (
                            <span className={styles.fieldError}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </span>
                        )}
                    </div>

                    {/* info strip */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, backgroundColor: "#f0f9f7", border: "1px solid #c8eee7ff", borderRadius: 12, padding: "11px 14px" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #14b8a6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>

                        <div style={{ fontSize: 11, fontWeight: 600, color: "#14b8a6", lineHeight: 1.5 }}>
                            A 6-digit verification code will be sent to your email. Code expires in 10 minutes.
                        </div>
                    </div>
                </div>

                <div className={styles.cardFooter}>
                    <button className={styles.primaryBtn} onClick={submit} disabled={loading}>
                        {loading ? (<><div className={styles.spinner} /> Sending code...</>) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                                Send Reset Code
                            </>
                        )}
                    </button>

                    <button className={styles.ghostBtn}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Sign In
                    </button>
                </div>
            </div>}
            {showResetModel && <ForgotOtpModel email={email} setForgotModel={setForgotModel} closeProfileForgotModel={closeProfileForgotModel} showProfileForgotModel={showProfileForgotModel}/>}
        </div>
    );
}
export default memo(Forgot)