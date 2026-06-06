import { useEffect, useState } from "react";
import { LockIcon } from "../Profile/Icons/Icon";
import styles from "./resetPassword.module.css"
import { toast } from "react-toastify";
import LoginSuccessMessage from "./LoginSuccessMessage";
import { useNavigate } from "react-router-dom";
import useLockScroll from "../../hooks/useLockScroll";

function getStrength(pwd) {
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
}

// const strengthLabel = ["", "Weak", "Fair", "Good", "Strong 💪"];
const strengthScore = ["s0", "s1", "s2", "s3", "s4"];

const requirements = [
    { label: "8+ chars", test: (p) => p.length >= 8 },
    { label: "Uppercase", test: (p) => /[A-Z]/.test(p) },
    { label: "Number", test: (p) => /[0-9]/.test(p) },
    { label: "Symbol", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function EyeIcon({ open }) {
    return open ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

export default function ResetPassword({ setForgotModel, closeProfileForgotModel, showProfileForgotModel }) {
    const [form, setForm] = useState({ newPwd: "", confirm: "" });
    const [show, setShow] = useState({ newPwd: false, confirm: false });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showResetMessage, setReset] = useState(false)

    const navigate = useNavigate()
    useEffect(() => {
        if (showResetMessage) {
            const timer = setTimeout(() => {
                navigate("/");
                if (showProfileForgotModel) {
                    closeProfileForgotModel(false)
                    return
                }
                setForgotModel(false)
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showResetMessage])
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const strength = getStrength(form.newPwd);
    const passwordsMatch = form.newPwd && form.confirm && form.newPwd === form.confirm;
    const passwordsMismatch = form.newPwd && form.confirm && form.newPwd !== form.confirm;

    const toggle = (field) => setShow(s => ({ ...s, [field]: !s[field] }));

    const handle = (field, val) => {
        setForm(f => ({ ...f, [field]: val }));
        if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
    };

    const validate = () => {
        const e = {};

        if (!form.newPwd) e.newPwd = "New password is required";
        else if (form.newPwd.length < 8) e.newPwd = "At least 8 characters required";
        else if (strength < 2) e.newPwd = "Password is too weak";

        if (!form.confirm) e.confirm = "Please confirm your new password";
        else if (form.newPwd !== form.confirm) e.confirm = "Passwords do not match";

        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) {
            setErrors(e);
            return;
        }

        setLoading(true);

        try {
            let res = await fetch(`${BASE_URL}/api/auth/password/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    confirmPassword: form.confirm
                }),
            });

            res = await res.json();
            console.log(res);

            if (!res.success) {
                throw new Error(data.message || "Something went wrong");
            }
            // success
            setReset(true)
            toast.success("Password reset success")
        } catch (err) {
            setErrors({ api: err.message });
        } finally {
            setLoading(false);
        }
    };
    useLockScroll()
    return (
        <div className={styles.modalOverlay}>
            {showResetMessage && <LoginSuccessMessage showResetMessage={showResetMessage} />}
            {!showResetMessage && <div className={styles.modalBox}>
                {/* HEADER */}
                <div className={styles.modalHeader}>
                    <div className={styles.headerLeft}>
                        <div className={styles.headerIcon}>
                            <div className={styles.headerIconPulse} />
                            <LockIcon />
                        </div>

                        <div className={styles.headerTitleWrap}>
                            <div className={styles.modalTitle}>Change Password</div>
                            <div className={styles.modalSub}>
                                Update your account security credentials
                            </div>
                        </div>
                    </div>
                </div>

                {/* BODY */}
                <div className={styles.modalBody}>

                    {/* NEW PASSWORD */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>New Password</label>

                        <div className={styles.inputWrap}>
                            <input
                                className={`${styles.fieldInput} ${errors.newPwd
                                    ? styles.hasError
                                    : form.newPwd && strength >= 3
                                        ? styles.hasSuccess
                                        : ""
                                    }`}
                                type={show.newPwd ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={form.newPwd}
                                onChange={e => handle("newPwd", e.target.value)}
                            />

                            <button className={styles.eyeBtn} onClick={() => toggle("newPwd")}>
                                <EyeIcon open={show.newPwd} />
                            </button>
                        </div>

                        {/* Strength */}
                        {form.newPwd && (
                            <div className={`${styles.strengthWrap} ${strengthScore[strength]}`}>
                                {/* <div className={styles.strengthBars}>
                                    {[1, 2, 3, 4].map(i => (
                                        <div
                                            key={i}
                                            className={`${styles.strengthBar} ${i <= strength ? styles.active : ""}`}
                                        />
                                    ))}
                                </div> */}

                                {/* <div className={styles.strengthMeta}>
                                    <span className={styles.strengthLabel}>
                                        {strengthLabel[strength]}
                                    </span>
                                </div> */}

                                <div className={styles.strengthReqs}>
                                    {requirements.map(r => (
                                        <span
                                            key={r.label}
                                            className={`${styles.req} ${r.test(form.newPwd) ? styles.met : ""}`}
                                        >
                                            {r.test(form.newPwd) ? "✓" : "+"}
                                            {r.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {errors.newPwd && (
                            <span className={styles.fieldError}>{errors.newPwd}</span>
                        )}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Confirm Password</label>

                        <div className={styles.inputWrap}>
                            <input
                                className={`${styles.fieldInput} ${errors.confirm
                                    ? styles.hasError
                                    : passwordsMatch
                                        ? styles.hasSuccess
                                        : ""
                                    }`}
                                type={show.confirm ? "text" : "password"}
                                placeholder="Re-enter your password"
                                value={form.confirm}
                                onChange={e => handle("confirm", e.target.value)}
                            />

                            <button className={styles.eyeBtn} onClick={() => toggle("confirm")}>
                                <EyeIcon open={show.confirm} />
                            </button>
                        </div>

                        {form.confirm && (
                            <div
                                className={`${styles.matchRow} ${passwordsMatch ? styles.matched : styles.mismatch
                                    }`}
                            >
                                {passwordsMatch ? "Password Matched" : "Password Not matched"}
                            </div>
                        )}

                        {errors.confirm && (
                            <span className={styles.fieldError}>{errors.confirm}</span>
                        )}
                    </div>

                </div>

                {/* FOOTER */}
                <div className={styles.modalFooter}>
                    <button
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Updating password..." : "Update Password"}
                    </button>

                    <button
                        className={styles.cancelBtn}
                        onClick={() => setForgotModel(false)}
                    >
                        Cancel
                    </button>
                </div>

            </div>}
        </div>
    );
}