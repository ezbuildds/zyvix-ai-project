import { useState } from "react";
import { LockIcon } from "./Icons/Icon";
import styles from "./changepassword.module.css"
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

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong 💪"];
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


export default function ChangePassword({ setChangePasswordModel, setProfileForgotModel }) {
    const [form, setForm] = useState({ current: "", newPwd: "", confirm: "" });
    const [show, setShow] = useState({ current: false, newPwd: false, confirm: false });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
        if (!form.current) e.current = "Current password is required";
        if (!form.newPwd) e.newPwd = "New password is required";
        else if (form.newPwd.length < 8) e.newPwd = "At least 8 characters required";
        else if (strength < 2) e.newPwd = "Password is too weak";
        if (!form.confirm) e.confirm = "Please confirm your new password";
        else if (form.newPwd !== form.confirm) e.confirm = "Passwords do not match";
        if (form.current && form.current === form.newPwd) e.newPwd = "New password must differ from current";
        return e;
    };
    const handleSubmit = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setLoading(true);
        setTimeout(() => { setLoading(false); setSuccess(true); }, 1800);
    };
    // useLockScroll()
    return (
        <>
            <div className={styles.modalOverlay}>
                <div className={styles.modalBox}>
                    {/* Header */}
                    <div className={styles.modalHeader}>
                        <div className={styles.headerLeft}>
                            {/* <div className={styles.headerIcon}>
                                <div className={styles.headerIconPulse} />
                                <LockIcon />
                            </div> */}

                            <div className={styles.headerTitleWrap}>
                                <div className={styles.modalTitle}>Change Password</div>
                                <div className={styles.modalSub}>
                                    Update your account security credentials
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className={styles.modalBody}>
                        {/* Current password */}
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                                Current Password
                                <span className={styles.fieldHintLink} onClick={() => { setProfileForgotModel(true); setChangePasswordModel(false) }}>Forgot password?</span>
                            </label>

                            <div className={styles.inputWrap}>
                                <span className={styles.inputIcon}>
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                </span>

                                <input
                                    className={`${styles.fieldInput} ${errors.current
                                        ? styles.hasError
                                        : form.current
                                            ? styles.hasSuccess
                                            : ""
                                        }`}
                                    type={show.current ? "text" : "password"}
                                    placeholder="Enter your current password"
                                    value={form.current}
                                    onChange={e => handle("current", e.target.value)}
                                />

                                <button
                                    className={styles.eyeBtn}
                                    onClick={() => toggle("current")}
                                >
                                    <EyeIcon open={show.current} />
                                </button>
                            </div>

                            {errors.current && (
                                <span className={styles.fieldError}>
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {errors.current}
                                </span>
                            )}
                        </div>
                        {/* New password */}
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>New Password</label>

                            <div className={styles.inputWrap}>
                                <span className={styles.inputIcon}>
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                                    </svg>
                                </span>

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

                                <button
                                    className={styles.eyeBtn}
                                    onClick={() => toggle("newPwd")}
                                >
                                    <EyeIcon open={show.newPwd} />
                                </button>
                            </div>

                            {/* Strength bars */}
                            {form.newPwd && (
                                <div className={`${styles.strengthWrap} ${strengthScore[strength]}`}>
                                    <div className={styles.strengthBars}>
                                        {[1, 2, 3, 4].map(i => (
                                            <div
                                                key={i}
                                                className={`${styles.strengthBar} ${i <= strength ? styles.active : ""
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <div className={styles.strengthMeta}>
                                        <span className={styles.strengthLabel}>
                                            {strengthLabel[strength]}
                                        </span>
                                    </div>

                                    <div className={styles.strengthReqs}>
                                        {requirements.map(r => (
                                            <span
                                                key={r.label}
                                                className={`${styles.req} ${r.test(form.newPwd) ? styles.met : ""
                                                    }`}
                                            >
                                                {r.test(form.newPwd) ? (
                                                    <svg
                                                        width="10"
                                                        height="10"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                    >
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        width="10"
                                                        height="10"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                    >
                                                        <line x1="12" y1="5" x2="12" y2="19" />
                                                        <line x1="5" y1="12" x2="19" y2="12" />
                                                    </svg>
                                                )}
                                                {r.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {errors.newPwd && (
                                <span className={styles.fieldError}>
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {errors.newPwd}
                                </span>
                            )}
                        </div>

                        {/* Confirm password */}
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                                Confirm New Password
                            </label>

                            <div className={styles.inputWrap}>
                                <span className={styles.inputIcon}>
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                </span>

                                <input
                                    className={`${styles.fieldInput} ${errors.confirm
                                        ? styles.hasError
                                        : passwordsMatch
                                            ? styles.hasSuccess
                                            : ""
                                        }`}
                                    type={show.confirm ? "text" : "password"}
                                    placeholder="Re-enter your new password"
                                    value={form.confirm}
                                    onChange={e => handle("confirm", e.target.value)}
                                />

                                <button
                                    className={styles.eyeBtn}
                                    onClick={() => toggle("confirm")}
                                >
                                    <EyeIcon open={show.confirm} />
                                </button>
                            </div>

                            {/* Match indicator */}
                            {form.confirm && (
                                <div
                                    className={`${styles.matchRow} ${passwordsMatch
                                        ? styles.matched
                                        : passwordsMismatch
                                            ? styles.mismatch
                                            : ""
                                        }`}
                                >
                                    {passwordsMatch ? (
                                        <>
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Passwords match — good to go!
                                        </>
                                    ) : passwordsMismatch ? (
                                        <>
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                strokeLinecap="round"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                            Passwords do not match
                                        </>
                                    ) : (
                                        <>Waiting for match...</>
                                    )}
                                </div>
                            )}

                            {errors.confirm && (
                                <span className={styles.fieldError}>
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {errors.confirm}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Footer buttons */}
                    <div className={styles.modalFooter}>
                        <button
                            className={styles.submitBtn}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className={styles.spinner} />
                                    Updating password...
                                </>
                            ) : (
                                <>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#fff"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    >
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    Update Password
                                </>
                            )}
                        </button>

                        <button className={styles.cancelBtn} onClick={() => { setChangePasswordModel(false) }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}