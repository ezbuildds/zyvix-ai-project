import { useState } from "react";
import "../css/Tool.css"
const tools = [
  {
    icon: "✏️",
    iconClass: "icon-blue",
    title: "AI Article Writer",
    desc: "Generate high-quality, engaging articles on any topic with our AI writing technology.",
  },
  {
    icon: "＃",
    iconClass: "icon-purple",
    title: "Blog Title Generator",
    desc: "Find the perfect, catchy title for your blog posts with our AI-powered generator.",
  },
  {
    icon: "🖼️",
    iconClass: "icon-green",
    title: "AI Image Generation",
    desc: "Create stunning visuals with our AI image generation tool. Experience the power of AI.",
  },
  {
    icon: "🧹",
    iconClass: "icon-orange",
    title: "Background Removal",
    desc: "Effortlessly remove backgrounds from your images with our AI-driven tool.",
  },
  {
    icon: "✂️",
    iconClass: "icon-indigo",
    title: "Object Removal",
    desc: "Remove unwanted objects from your images seamlessly with our AI object removal tool.",
  },
  {
    icon: "📄",
    iconClass: "icon-teal",
    title: "Resume Reviewer",
    desc: "Get your resume reviewed by AI to improve your chances of landing your dream job.",
  },
];

// SVG Icons (clean, modern)
const IconPen = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const IconHash = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);

const IconImage = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const IconEraser = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 20H7L3 16l10-10 7 7-3.5 3.5"/><path d="M6.5 17.5l4-4"/>
  </svg>
);

const IconScissors = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);

const IconDoc = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);

const iconComponents = [IconPen, IconHash, IconImage, IconEraser, IconScissors, IconDoc];

export default function ToolsSection() {
  const [hovered, setHovered] = useState(null);

  return (
    <>
      {/* <style>{styles}</style> */}
      <section className="tools-section">
        <div className="tools-header">
          <h2>Powerful AI Tools</h2>
          <p>Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.</p>
        </div>

        <div className="tools-grid">
          {tools.map((tool, i) => {
            const Icon = iconComponents[i];
            return (
              <div
                key={i}
                className="tool-card"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className={`icon-wrap ${tool.iconClass}`}>
                  <Icon />
                </div>
                <h3>{tool.title}</h3>
                <p>{tool.desc}</p>
                <div className="card-arrow">→</div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}