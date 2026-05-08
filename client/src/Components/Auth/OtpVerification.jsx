import styles from "./OtpVerification.module.css";
import React, { useState, useRef, useEffect } from "react";
import { authData } from "../../Context/ContextApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginSuccessMessage from "./LoginSuccessMessage";


const MAX_ATTEMPTS = 3;
export default function OtpVerification({ email, openOtpModel }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [showSuccessModel, setSuccessModel] = useState(false)
  const [resData, setResponceData] = useState(null)
  const { setUser } = authData()

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate()
  const inputRefs = useRef([]);
  useEffect(() => {
    if (showSuccessModel) {
      const timer = setTimeout(() => {
        setUser(resData)
        navigate("/")
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showSuccessModel])
  /* countdown */
  useEffect(() => {
    if (!timer) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);
  const formatTimer = (s) => `0:${String(s).padStart(2, "0")}`;

  const resetOtp = () => {
    setDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleDigit = (i, val) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = digit;

    setDigits(next);
    setFeedback("");
    setStatus("idle");

    if (digit && i < 5) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        const next = [...digits];
        next[i] = "";
        setDigits(next);
      } else if (i > 0) {
        inputRefs.current[i - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && i > 0)
      inputRefs.current[i - 1]?.focus();

    if (e.key === "ArrowRight" && i < 5)
      inputRefs.current[i + 1]?.focus();

    if (e.key === "Enter") handleVerify();
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const next = ["", "", "", "", "", ""];
    pasted.split("").forEach((d, i) => {
      next[i] = d;
    });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };
  const allFilled = digits.every(Boolean);
  const handleVerify = async () => {
    if (!allFilled) {
      setFeedback("Please enter all 6 digits");
      return;
    }
    setStatus("loading");
    try {
      const otp = digits.join("");
      let res = await fetch(`${BASE_URL}/api/auth/signup/verify-otp`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp }),
        }
      );
      res = await res.json();
      console.log(res);

      if (res.success) {
        setStatus("success");
        setResponceData(res.data)
        setSuccessModel(true)
        toast.success("Verification success")
        return
      } else {
        throw new Error(res.message || "Invalid OTP");
      }
    } catch (err) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setStatus("error");

      if (newAttempts >= MAX_ATTEMPTS) {
        setFeedback("Too many attempts. Request a new code.");
      } else {
        setFeedback(err.message);
      }
      resetOtp();
    }
  };

  /* resend (abhi simple, API optional later) */
  const handleResend = async () => {
    if (timer > 0) return;
    try {
      let res = await fetch(`${BASE_URL}/api/auth/signup/resend-otp`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ type: "signup" })
      });
      res = await res.json();
      if (!res.success) {
        toast.error(res.message);
        if (res.countDown) {
          setTimer(res.countDown);
        }
        return;
      }
      toast.success("OTP resent");
      setTimer(res.countDown || 20);
      resetOtp();
      setFeedback("");
      setStatus("idle");

    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  const getBoxClass = (i) => {
    if (status === "error") return `${styles.otpBox} ${styles.error}`;
    if (status === "success") return `${styles.otpBox} ${styles.success}`;
    if (digits[i]) return `${styles.otpBox} ${styles.filled}`;
    return styles.otpBox;
  };
  return (
    <>
      {showSuccessModel && <LoginSuccessMessage showSuccessMessage={showSuccessModel} />}
      {/* <div className={styles.pageShell}> */}
      {!showSuccessModel && <div className={styles.otpCard}>
        {/* <div className={styles.cardStrip} /> */}
        {/* Header */}
        <div className={styles.cardHeader}>
          <div className={styles.brandRow}>
            {/* <LogoIcon /> */}
          </div>
          <div className={styles.otpIconWrap}>
            <div className={styles.otpIconPulse} />
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
              <path d="M14.5 2.5c1.5.5 3 1.5 4 3M17 0c2 1 4 3 4.5 5.5" />
            </svg>
          </div>
          <div className={styles.headerTitle}>Check your <span>inbox</span></div>
          <div className={styles.headerSub}>
            We sent a 6-digit verification code to
          </div>
          <div className={styles.emailChip}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            {email}
          </div>
        </div>

        {/* OTP inputs */}
        <div className={styles.otpSection}>
          <div className={styles.otpLabel}>Enter 6-digit code</div>
          <div className={styles.otpInputs} onPaste={handlePaste}>
            {digits.map((d, i) => (
              <React.Fragment key={i}>
                {/* {i === 3 && <span key="sep" className={styles.otpSep}>–</span>} */}
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  className={getBoxClass(i)}
                  value={d}
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  onChange={e => handleDigit(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              </React.Fragment>
            ))}
          </div>
          {/* Feedback */}
          <div
            className={`${styles.otpFeedback} ${status === "error"
              ? styles.err
              : status === "success"
                ? styles.ok
                : ""
              }`}
          >
            {status === "error" && (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {feedback}
              </>
            )}
            {status === "idle" && feedback && (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color: "#f59e0b" }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span style={{ color: "#f59e0b" }}>{feedback}</span>
              </>
            )}
          </div>

          {/* Attempts dots */}
          {attempts > 0 && (
            <div className={styles.attemptsRow}>
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <div
                  key={i}
                  className={`${styles.attemptDot} ${i < attempts
                    ? styles.used
                    : i === attempts
                      ? styles.active
                      : ""
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Verify button */}
        <div className={styles.btnSection}>
          <button
            className={styles.verifyBtn}
            onClick={handleVerify}
            disabled={status === "loading" || !allFilled || attempts >= MAX_ATTEMPTS}
          >
            {status === "loading" ? (
              <>
                <div className={styles.spinner} /> Verifying...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Verify
              </>
            )}
          </button>
        </div>

        {/* Resend */}
        <div className={styles.resendSection}>
          <p className={styles.resendText}>
            Didn't receive the code?{" "}
            {timer > 0 ? (
              <span className={styles.resendTimer}>
                Resend in {formatTimer(timer)}
              </span>
            ) : (
              <button className={styles.resendBtn} onClick={handleResend} >
                Resend code {resendCount > 0 ? `(${resendCount})` : ""}
              </button>
            )}
          </p>
        </div>

        {/* Back */}
        <button className={styles.backLink} onClick={() => openOtpModel(false)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to sign up
        </button>

        {/* Footer */}
        {/* <div className={styles.footerBar}>
          <div className={styles.footerBrand}>
            Zyvix.ai · Secure Auth
          </div>
          <div className={styles.footerSecure}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            256-bit encrypted
          </div>
        </div> */}

      </div>}
      {/* </div> */}
    </>
  );
}