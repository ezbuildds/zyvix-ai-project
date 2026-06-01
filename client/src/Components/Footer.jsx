import { useState, memo } from "react";
import styles from "../css/Footer.module.css";
import { LogoIcon } from "./Auth/Authicon/AuthIcon";



const companyLinks = [
  { label: "Home", href: "#" },
  { label: "About us", href: "#" },
  { label: "Contact us", href: "#" },
  { label: "Privacy policy", href: "#" },
];

function Footer() {
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
              {/* <LogoIcon /> */}
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
          <p>Develop By ( Manu Patel )</p>
        </div>
      </footer>
    </>
  );
}
export default memo(Footer)