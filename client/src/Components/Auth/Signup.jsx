
import { useState,memo } from "react";
import styles from "./signup.module.css";
import OtpVerification from "./OtpVerification";
import { GithubIcon, GoogleIcon, LogoIcon } from "./Authicon/AuthIcon";
import { toast } from "react-toastify";

function getStrength(pwd) {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
}
const strengthMeta = ["", "weak", "fair", "good", "strong"];
// const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];



 function Signup({ openSignupModel, openLoginModel }) {
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPwd, setShowPwd] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showOtpModel, setOtpModel] = useState(false);
    const [email, setEmail] = useState("");

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const strength = getStrength(form.password);
    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = "First name is required";
        if (!form.lastName.trim()) e.lastName = "Last name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
        if (!form.password) e.password = "Password is required";
        else if (form.password.length < 8) e.password = "At least 8 characters";
        if (!agreed) e.terms = "Please accept the terms";
        return e;
    };

    const handleChange = (field, val) => {
        setForm(f => ({ ...f, [field]: val }));
        if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) {
            setErrors(e);
            return;
        }

        try {
            setLoading(true);

            let res = await fetch(`${BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    username: form.firstName + " " + form.lastName, // combine
                    email: form.email,
                    password: form.password
                })
            });

            res = await res.json();
            console.log(res);
            setLoading(false);
            if (!res.success) {
                setErrors({ api: res.message });
                return
            }
            toast.success(res.message)
            setOtpModel(true);
            setEmail(res.email);
        } catch (err) {
            setLoading(false);
            console.error(err);
            setErrors({ api: "Something went wrong" });
        }
    };
    return (
        <>
            {showOtpModel && (
                <div className={styles.modalOverlay}>
                    <OtpVerification email={email} openOtpModel={setOtpModel} />
                </div>
            )}
            {!showOtpModel && <div className={styles.modalOverlay}>
                <div className={styles.pageShell}>
                    <div className={styles.signupCard}>
                        {/* Header */}
                        <div className={styles.cardHeader}>
                            <div className={styles.brandRow}>
                                <LogoIcon />
                                <span className={styles.brandName}>Zyvix.ai</span>
                                <button
                                    className={styles.closeBtn}
                                    onClick={() => openSignupModel(false)}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className={styles.headerTitle}>Create your <span>free account</span></div>
                            <div className={styles.headerSub}>Join 10,000+ creators building with AI tools</div>
                        </div>

                        {/* Form */}
                        <div className="cardForm">

                            {/* Name row */}
                            <div className={styles.nameRow}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>First Name</label>
                                    <div className={styles.inputWrap}>
                                        <span className={styles.inputIcon}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 00-16 0" />
                                            </svg>
                                        </span>
                                        <input
                                            className={`${styles.fieldInput} ${errors.firstName ? styles.error : form.firstName ? styles.success : ""}`}
                                            placeholder="John"
                                            value={form.firstName}
                                            onChange={e => handleChange("firstName", e.target.value)}
                                        />
                                    </div>
                                    {errors.firstName && <span className={styles.fieldError}>⚠ {errors.firstName}</span>}
                                </div>

                                <div className={styles.fieldGroup}>
                                    <label className={styles.fieldLabel}>Last Name</label>
                                    <div className={styles.inputWrap}>
                                        <span className={styles.inputIcon}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 00-16 0" />
                                            </svg>
                                        </span>
                                        <input
                                            className={`${styles.fieldInput} ${errors.lastName ? styles.error : form.lastName ? styles.success : ""}`}
                                            placeholder="Doe"
                                            value={form.lastName}
                                            onChange={e => handleChange("lastName", e.target.value)}
                                        />
                                    </div>
                                    {errors.lastName && <span className={styles.fieldError}>⚠ {errors.lastName}</span>}
                                </div>
                            </div>

                            {/* Email */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Email Address</label>
                                <div className={styles.inputWrap}>
                                    <span className={styles.inputIcon}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </span>
                                    <input
                                        className={`${styles.fieldInput} ${errors.email ? styles.error : form.email && /\S+@\S+\.\S+/.test(form.email) ? styles.success : ""}`}
                                        placeholder="john@example.com"
                                        type="email"
                                        value={form.email}
                                        onChange={e => handleChange("email", e.target.value)}
                                    />
                                </div>
                                {errors.email && <span className={styles.fieldError}>⚠ {errors.email}</span>}
                            </div>

                            {/* Password */}
                            <div className={styles.fieldGroup}>
                                <label className={styles.fieldLabel}>Password</label>
                                <div className={styles.inputWrap}>
                                    <span className={styles.inputIcon}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                        </svg>
                                    </span>
                                    <input
                                        className={`${styles.fieldInput} ${errors.password ? styles.error : form.password && strength >= 3 ? styles.success : ""}`}
                                        placeholder="Min. 8 characters"
                                        type={showPwd ? "text" : "password"}
                                        value={form.password}
                                        onChange={e => handleChange("password", e.target.value)}
                                    />
                                    <button className={styles.eyeBtn} onClick={() => setShowPwd(s => !s)} type="button">
                                        {showPwd ? (
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {form.password && (
                                    <>
                                        <div className={styles.strengthBar}>
                                            {[1, 2, 3, 4].map(i => (
                                                <div
                                                    key={i}
                                                    className={`${styles.strengthSeg} ${i <= strength ? styles[strengthMeta[strength]] : ""}`}
                                                />
                                            ))}
                                        </div>
                                        {/* <div className={`${styles.strengthLabel} ${styles[strengthMeta[strength]]}`}>
                                            {strengthLabel[strength]}
                                        </div> */}
                                    </>
                                )}

                                {errors.password && <span className={styles.fieldError}>⚠ {errors.password}</span>}
                            </div>

                            {/* Terms */}
                            <div className={styles.termsRow}>
                                <input
                                    type="checkbox"
                                    className={styles.termsCheckbox}
                                    checked={agreed}
                                    onChange={e => {
                                        setAgreed(e.target.checked);
                                        if (errors.terms) setErrors(er => ({ ...er, terms: "" }));
                                    }}
                                />
                                <div className={styles.termsText}>
                                    I agree to Quick.ai's <a href="#" className={styles.termsLink}>Terms of Service</a> and <a href="#" className={styles.termsLink}>Privacy Policy</a>. I understand my data will be handled securely.
                                </div>
                            </div>
                            {errors.terms && <span className={styles.fieldError} style={{ marginTop: -8 }}>⚠ {errors.terms}</span>}
                            {errors.api && <span className={styles.fieldError} style={{ marginTop: -8 }}>⚠ {errors.api}</span>}

                            {/* Submit */}
                            <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
                                {loading ? (
                                    <><div className={styles.spinner} /> Creating account...</>
                                ) : (
                                    <>Create Free Account →</>
                                )}
                            </button>
                            {/* Social */}
                            <div className={styles.divider}>
                                <div className={styles.dividerLine} />
                                <span className={styles.dividerText}>or sign up with email</span>
                                <div className={styles.dividerLine} />
                            </div>
                            <div className={styles.socialRow}>
                                <button className={styles.socialBtn}>
                                    <GoogleIcon /> Google
                                </button>
                                <button className={styles.socialBtn} style={{ color: "#1e1b4b" }}>
                                    <GithubIcon /> GitHub
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={styles.cardFooter}>
                            <p className={styles.signinText}>
                                Already have an account?{" "}
                                <span className={styles.signinLink} onClick={() => { openLoginModel(true); openSignupModel(false); }}>Sign in</span>
                            </p>
                        </div>

                        {/* Bottom bar */}
                        {/* <div className={styles.bottomBar}>
                            <div className={styles.bottomBrand}>
                                <LogoIcon /> Quick.ai · All rights reserved
                            </div>
                            <div className={styles.bottomSecure}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                                256-bit encrypted
                            </div>
                        </div> */}

                    </div>
                </div>
            </div>}
        </>
    );
}
export default memo(Signup)