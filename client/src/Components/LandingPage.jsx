import { useEffect, useState, useCallback } from "react";
import "../App.css"
import Navbar from "./Navbar/Navbar.jsx";
import ToolsSection from "./Tools.jsx";
import Footer from "./Footer.jsx";
import { Link } from "react-router-dom";
import Signup from "./Auth/Signup.jsx";
import Login from "./Auth/Login.jsx";
import Forgot from "./Auth/Forgot.jsx";
import { authData } from "../Context/ContextApi.jsx";

const brands = [
  { cls: "linkedin", content: <><span style={{ fontWeight: 900, fontSize: 15, background: "#0077b5", color: "#fff", padding: "2px 5px", borderRadius: 3 }}>in</span>LinkedIn</> },
  { cls: "instagram", content: "Instagram" },
  { cls: "facebook", content: <><span style={{ fontSize: 20, fontWeight: 900 }}></span>facebook</> },
  { cls: "slack", content: <><span style={{ fontSize: 16 }}>✦</span> slack</> },
  { cls: "framer", content: <><span style={{ fontSize: 14 }}>◀</span> Framer</> },
  { cls: "netflix", content: "NETFLIX" },
  {
    cls: "google",
    content: (
      <span style={{
        background: "linear-gradient(90deg,#4285f4,#ea4335,#fbbc04,#34a853)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontWeight: 700,
      }}>
        Google
      </span>
    ),
  },
];
const words = ["AI tools"];

export default function LandingPage() {
  const [openSignupModel, setSignupModel] = useState(false)
  const [showLoginModel, setLoginModel] = useState(false)
  const [showForgotModel, setForgotModel] = useState(false)

  const { user } = authData()
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index];
    const speed = isDeleting ? 50 : 90;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));
        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));
        if (text === "") {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, index]);

  return (
    <>
      <div className="page">
        <div className="bg-gradient" />

        <Navbar openSignupModel={setSignupModel} />
        {openSignupModel && <Signup openSignupModel={setSignupModel} openLoginModel={setLoginModel} />}
        {showLoginModel && <Login openSignupModel={setSignupModel} openLoginModel={setLoginModel} openForgotModel={setForgotModel} />}
        {showForgotModel && <Forgot setForgotModel={setForgotModel} />}

        {/* Hero */}
        <section className="hero">
          <div className="ai-capsule">
            <span className="capsule-dot" />
            <span className="capsule-icon">✦</span>
            <span>AI Powered Content 🚀</span>
            <span className="capsule-tag">NEW</span>
          </div>
          <h1>
            Build stunning content<br />
            <span className="with-fixed">with</span>{" "}
            <span className="animated-text">{text}</span>
            <span className="cursor">|</span>
          </h1>

          <p>
            Transform your content creation with our suite of premium AI tools.
            Write articles, generate images, and enhance your workflow.
          </p>

          <div className="btn-group">
            <Link to="/dashboard" className="btn-primary" onClick={(e) => { if (!user) { e.preventDefault(); setLoginModel(true); } }}>Start creating now ✨</Link>
            <Link to="/dashboard" className="btn-secondary">Watch demo</Link>
          </div>

          <div className="trust">
            <div className="avatars">
              <div className="avatar">A</div>
              <div className="avatar">B</div>
              <div className="avatar">C</div>
              <div className="avatar">D</div>
            </div>
            <span className="trust-text">Trusted by 10k+ people</span>
          </div>

          <div className="scroller-section">
            <div className="scroller-track">
              {[...brands, ...brands].map((b, i) => (
                <span key={i} className={`brand ${b.cls}`}>
                  {b.content}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <ToolsSection />
      <Footer />
    </>
  );
}