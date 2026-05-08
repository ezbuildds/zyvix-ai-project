import React, { useState } from "react";
import styles from "./signup.module.css";
import { LogoIcon } from "./Authicon/AuthIcon";
import { authData } from "../../Context/ContextApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginSuccessMessage from "./LoginSuccessMessage";
import { toast } from "react-toastify";
export default function Login({ openSignupModel, openLoginModel, openForgotModel }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [resData, setResponse] = useState(null)
    const [showPwd, setShowPwd] = useState(false);
    const [showLoginMessage, setLoginMessage] = useState(false)
    const { setUser } = authData()

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate()
    useEffect(() => {
        if (showLoginMessage) {
            const timer = setTimeout(() => {
                setUser(resData);
                navigate("/");
                openLoginModel(false)
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showLoginMessage]);

    const validate = () => {
        const e = {};
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter valid email";

        if (!form.password) e.password = "Password is required";
        else if (form.password.length < 8) e.password = "Min 8 characters";

        return e;
    };

    const handleChange = (field, val) => {
        setForm(f => ({ ...f, [field]: val }));
        if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) return setErrors(e);
        try {
            setLoading(true);
            let res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                })
            });
            res = await res.json();
            setLoading(false);
            if (res.success) {
                setResponse(res.data)
                console.log(res.data);
                setLoginMessage(true)
                toast.success(res.message)
            } else {
                setErrors({ api: res.message });
                return;
            }

        } catch (err) {
            setLoading(false);
            setErrors({ api: "Something went wrong" });
        }
    };

    return (
        <div className={styles.modalOverlay}>
            {showLoginMessage && <LoginSuccessMessage showLoginMessage={showLoginMessage} />}
            {!showLoginMessage && <div className={styles.signupCard}>
                {/* Header */}
                <div className={styles.cardHeader}>
                    <div className={styles.brandRow}>
                        <LogoIcon />
                        <span className={styles.brandName}>Zyvix.ai</span>
                        <button className={styles.closeBtn} onClick={() => openLoginModel(false)}>✕ </button>
                    </div>

                    <div className={styles.headerTitle}>
                        Login your <span>account</span>
                    </div>

                    <div className={styles.headerSub}>
                        Simple Login to get started
                    </div>
                </div>

                {/* Form */}
                <div className={styles.cardForm}>

                    {/* Email */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Email</label>
                        <div className={styles.inputWrap}>
                            <span className={styles.inputIcon}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </span>
                            <input
                                className={`${styles.fieldInput} ${errors.email ? styles.error : ""
                                    }`}
                                placeholder="john@example.com"
                                value={form.email}
                                onChange={e => handleChange("email", e.target.value)}
                            />
                        </div>
                        {errors.email && (
                            <span className={styles.fieldError} style={{paddingTop: "0px"}}>⚠ {errors.email}</span>
                        )}
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
                                className={`${styles.fieldInput} ${errors.email ? styles.error : ""
                                    }`}
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
                        {errors.password && (
                            <span className={styles.fieldError} style={{paddingTop: "0px"}}>⚠ {errors.password}</span>
                        )}
                    </div>

                    {/* API error */}
                    {errors.api && (<span className={styles.fieldError} style={{paddingTop: "0px"}}> ⚠ {errors.api} </span>)}
                    <div className={styles.forgotPassword} ><span onClick={() => { openForgotModel(true); openLoginModel(false) }}>Forgot password?</span></div>
                    {/* Submit */}
                    <button
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{ marginTop: "0px" }}
                    >
                        {loading ? (
                            <>
                                <div className={styles.spinner} /> Loggin...
                            </>
                        ) : (
                            <>Login</>
                        )}
                    </button>

                </div>

                {/* Footer */}
                <div className={styles.cardFooter} style={{ marginTop: "14px" }}>
                    <p className={styles.signinText}>
                        Create new account?{" "}
                        <span className={styles.signinLink} onClick={() => { openSignupModel(true); openLoginModel(false); }}>Sign up</span>
                    </p>
                </div>

            </div>}
        </div>
    );
}