
import { useState, memo } from "react";
import styles from "./forgot.module.css";
import OtpVerification from "./OtpVerification";
import ForgotOtpModel from "./ForgotOtpModel";
import { BackIcon, ErrorIcon, InputIcon, PulseIcon, SendIcon } from "./Authicon/AuthIcon";

function Forgot({ setForgotModel, showProfileForgotModel, closeProfileForgotModel,setLoginModel }) {
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
                        <PulseIcon />
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
                                <InputIcon />
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
                                <ErrorIcon />
                                {error}
                            </span>
                        )}
                    </div>

                    {/* info strip */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, backgroundColor: "#f5f3ff", border: "1px solid #e8e4ff", borderRadius: 12, padding: "11px 14px" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#9381ff", lineHeight: 1.5, textAlign: "center" }}>
                            A 6-digit verification code will be sent to your email. Code expires in 10 minutes.
                        </div>
                    </div>
                </div>

                <div className={styles.cardFooter}>
                    <button className={styles.primaryBtn} onClick={submit} disabled={loading}>
                        {loading ? (<><div className={styles.spinner} /> Sending code...</>) : (
                            <>
                                <SendIcon />
                                Send Reset Code
                            </>
                        )}
                    </button>

                    <button className={styles.ghostBtn} onClick={()=>{setForgotModel(false);setLoginModel(true)}}>
                        <BackIcon />
                        Back to Sign In
                    </button>
                </div>
            </div>}
            {showResetModel && <ForgotOtpModel email={email} setForgotModel={setForgotModel} setLoginModel={setLoginModel} closeProfileForgotModel={closeProfileForgotModel} showProfileForgotModel={showProfileForgotModel} />}
        </div>
    );
}
export default memo(Forgot)