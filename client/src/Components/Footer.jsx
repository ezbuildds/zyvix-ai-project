import { useState } from "react";
// import "../css/Footer.css"
import styles from "../css/Footer.module.css";
const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
    <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" fill="#4f46e5" opacity="0.15" />
    <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="#4f46e5" strokeWidth="1.5" fill="none" />
    <circle cx="14" cy="14" r="3" fill="#4f46e5" />
    <line x1="14" y1="2" x2="14" y2="11" stroke="#4f46e5" strokeWidth="1.5" />
    <line x1="14" y1="17" x2="14" y2="26" stroke="#4f46e5" strokeWidth="1.5" />
    <line x1="4" y1="8" x2="11" y2="12" stroke="#4f46e5" strokeWidth="1.5" />
    <line x1="17" y1="16" x2="24" y2="20" stroke="#4f46e5" strokeWidth="1.5" />
    <line x1="24" y1="8" x2="17" y2="12" stroke="#4f46e5" strokeWidth="1.5" />
    <line x1="11" y1="16" x2="4" y2="20" stroke="#4f46e5" strokeWidth="1.5" />
  </svg>
);

const companyLinks = [
  { label: "Home", href: "#" },
  { label: "About us", href: "#" },
  { label: "Contact us", href: "#" },
  { label: "Privacy policy", href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <>
      {/* <style>{styles}</style> */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>

          {/* Brand col */}
          <div>
            <a href="#" className={styles.footerLogo}>
              <LogoIcon />
              Quick.ai
            </a>
            <p className={styles.footerDesc}>
              Experience the power of AI with QuickAI.<br />
              Transform your content creation with our suite of premium AI tools.
              Write articles, generate images, and enhance your workflow.
            </p>
          </div>

          {/* Company links */}
          <div className={styles.footerCol}>
            <h4>Company</h4>
            <ul className={styles.footerLinks}>
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className={styles.newsletterCol}>
            <h4>Subscribe to our newsletter</h4>
            <p className={styles.newsletterColPara}>The latest news, articles, and resources, sent to your inbox weekly.</p>
            {!subscribed ? (
              <div className={styles.newsletterForm}>
                <input
                  className={styles.newsletterInput}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                />
                <button className={styles.newsletterBtn} onClick={handleSubscribe}>
                  Subscribe
                </button>
              </div>
            ) : (
              <p className={styles.successMsg}>✓ You're subscribed! Welcome aboard.</p>
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className={styles.footerBottom}>
          <p>Copyright 2025 © Zyvix.ai All Right Reserved.</p>
        </div>
      </footer>
    </>
  );
}