import { useState } from "react";
import styles from "../../css/Dashboard.module.css"
import Sidebar from "./Sidebar";
import { authData } from "../../Context/ContextApi";

const mockGenerations = [
    {
        id: 1,
        type: "article",
        title: "The Future of Artificial Intelligence in Healthcare",
        prompt: "Write a detailed article about how AI is transforming modern healthcare systems...",
        date: "2026-05-10T14:32:00",
        words: 820,
        tone: "Professional",
        credits: 2,
    },
    {
        id: 2,
        type: "image",
        title: "Futuristic City Skyline at Night",
        prompt: "A breathtaking futuristic city skyline at night with neon lights and flying cars...",
        date: "2026-05-09T09:15:00",
        style: "Photorealistic",
        credits: 3,
    },
    {
        id: 3,
        type: "article",
        title: "How to Learn Web Development Fast in 2026",
        prompt: "Create a comprehensive guide for beginners who want to learn web development quickly...",
        date: "2026-05-08T18:45:00",
        words: 1250,
        tone: "Casual",
        credits: 2,
    },
    {
        id: 4,
        type: "article",
        title: "Top 10 Marketing Strategies for 2026",
        prompt: "Write a persuasive article on the most effective marketing strategies for this year...",
        date: "2026-05-07T11:20:00",
        words: 1050,
        tone: "Persuasive",
        credits: 2,
    },
    {
        id: 5,
        type: "image",
        title: "Minimalist Abstract Art — Ocean Waves",
        prompt: "Generate a minimalist abstract artwork inspired by calm ocean waves in blue tones...",
        date: "2026-05-06T16:00:00",
        style: "Abstract",
        credits: 3,
    },
    {
        id: 6,
        type: "article",
        title: "Beginner's Guide to Investing in Stocks",
        prompt: "Explain the basics of stock market investing for someone who has never invested before...",
        date: "2026-05-05T08:30:00",
        words: 960,
        tone: "Informative",
        credits: 2,
    },
];

const TOTAL_CREDITS = 20;
const USED_CREDITS = 14;

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function formatTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

const toneColors = {
    Professional: { bg: "#EEF0FE", color: "#4338CA" },
    Casual: { bg: "#E8F5F0", color: "#1A7A52" },
    Persuasive: { bg: "#FEF3E7", color: "#A05D08" },
    Informative: { bg: "#FCF0F8", color: "#9A2E6E" },
    Photorealistic: { bg: "#E8F0FE", color: "#1A56A5" },
    Abstract: { bg: "#F0EEF8", color: "#6B42C4" },
};

export default function ContentDashboard() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [expanded, setExpanded] = useState(null);
    const {user}=authData()

    const filtered = mockGenerations.filter((g) => {
        const matchSearch =
            g.title.toLowerCase().includes(search.toLowerCase()) ||
            g.prompt.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || g.type === filter;
        return matchSearch && matchFilter;
    });

    const articleCount = mockGenerations.filter((g) => g.type === "article").length;
    const imageCount = mockGenerations.filter((g) => g.type === "image").length;
    const creditPct = (USED_CREDITS / TOTAL_CREDITS) * 100;

    return (
        <div className={styles.dbRoot}>
            <Sidebar />
            <div className={styles.root}>
                {/* ── Background grain overlay ── */}
                <div className={styles.grain} />

                {/* ── Top Header ── */}
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.logoMark}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#FBBF24" />
                            </svg>
                        </div>

                        <div>
                            <div className={styles.appName}>CreatorAI</div>
                            <div className={styles.appTagline}>Your generation history</div>
                        </div>
                    </div>

                    {/* Credit Bar */}
                    <div className={styles.creditBox}>
                        <div className={styles.creditRow}>
                            <span className={styles.creditLabel}>Credits</span>

                            <span className={styles.creditNums}>
                                <span className={styles.creditUsed}>{user?.remainingLimit}</span>

                                <span className={styles.creditSlash}>
                                    {" "}
                                    / {TOTAL_CREDITS}
                                </span>
                            </span>
                        </div>

                        <div className={styles.creditBarBg}>
                            <div
                                className={styles.creditBarFill}
                                style={{
                                    width: `${creditPct}%`,
                                    background:
                                        creditPct > 80
                                            ? "linear-gradient(90deg,#F87171,#EF4444)"
                                            : "linear-gradient(90deg,#34D399,#059669)",
                                }}
                            />
                        </div>

                        <div className={styles.creditRemaining}>
                            {TOTAL_CREDITS - USED_CREDITS} credits remaining
                        </div>
                    </div>

                    <button className={styles.upgradeBtn}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#1A1A2E" />
                        </svg>

                        Upgrade Plan
                    </button>
                </header>

                {/* ── Stats Row ── */}
                <div className={styles.statsRow}>
                    {[
                        {
                            label: "Total Generated",
                            value: mockGenerations.length,
                            sub: "All time",
                            icon: "⬡",
                            accent: "#6366F1",
                            bg: "#EEF2FF",
                        },
                        {
                            label: "Articles Written",
                            value: articleCount,
                            sub: `${articleCount * 950} avg words`,
                            icon: "✦",
                            accent: "#0EA5E9",
                            bg: "#E0F2FE",
                        },
                        {
                            label: "Images Created",
                            value: imageCount,
                            sub: "High quality",
                            icon: "◈",
                            accent: "#F59E0B",
                            bg: "#FEF3C7",
                        },
                        {
                            label: "Credits Used",
                            value: USED_CREDITS,
                            sub: `${TOTAL_CREDITS - USED_CREDITS} left`,
                            icon: "⚡",
                            accent: "#10B981",
                            bg: "#D1FAE5",
                        },
                    ].map((s, i) => (
                        <div key={i} className={styles.statCard} >
                            <div style={{ background: s.bg, color: s.accent }} className={styles.statIcon}>
                                {s.icon}
                            </div>
                            <div style={{ color: s.accent }} className={styles.statValue}>{s.value}</div>
                            <div className={styles.statLabel}>{s.label}</div>
                            <div className={styles.statSub}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* ── Controls ── */}
                <div className={styles.controls}>
                    <div className={styles.searchWrap}>
                        <svg
                            className={styles.searchIcon}
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#94A3B8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>

                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Search by title or prompt…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        {["all", "article", "image"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""
                                    }`}
                            >
                                {f === "all"
                                    ? "All"
                                    : f === "article"
                                        ? "✦ Articles"
                                        : "◈ Images"}
                            </button>
                        ))}
                    </div>
                </div>
                {/* ── Generation List ── */}
                <div className={styles.list}>
                    {filtered.length === 0 ? (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>◌</div>

                            <div className={styles.emptyText}>
                                No generations found
                            </div>

                            <div className={styles.emptySub}>
                                Try adjusting your search or filter
                            </div>
                        </div>
                    ) : (
                        filtered.map((g) => {
                            const tone = g.type === "article" ? g.tone : g.style;

                            const tc =
                                toneColors[tone] || {
                                    bg: "#F1F5F9",
                                    color: "#64748B",
                                };

                            const isOpen = expanded === g.id;

                            return (
                                <div
                                    key={g.id}
                                    className={`${styles.card} ${isOpen ? styles.cardOpen : ""
                                        }`}
                                    onClick={() => setExpanded(isOpen ? null : g.id)}
                                >
                                    {/* Type pill */}
                                    <div className={styles.cardLeft}>
                                        <div
                                            className={styles.typeIcon}
                                            style={{
                                                background:
                                                    g.type === "article"
                                                        ? "#EEF2FF"
                                                        : "#FEF3C7",
                                                color:
                                                    g.type === "article"
                                                        ? "#4F46E5"
                                                        : "#D97706",
                                            }}
                                        >
                                            {g.type === "article" ? (
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                                </svg>
                                            ) : (
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect
                                                        x="3"
                                                        y="3"
                                                        width="18"
                                                        height="18"
                                                        rx="3"
                                                    />

                                                    <circle
                                                        cx="8.5"
                                                        cy="8.5"
                                                        r="1.5"
                                                    />

                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.cardBody}>
                                        <div className={styles.cardTop}>
                                            <div className={styles.cardTitle}>
                                                {g.title}
                                            </div>

                                            <div className={styles.cardMeta}>
                                                <span className={styles.metaDate}>
                                                    <svg
                                                        width="11"
                                                        height="11"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="#94A3B8"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        style={{ marginRight: 4 }}
                                                    >
                                                        <rect
                                                            x="3"
                                                            y="4"
                                                            width="18"
                                                            height="18"
                                                            rx="2"
                                                        />

                                                        <line
                                                            x1="16"
                                                            y1="2"
                                                            x2="16"
                                                            y2="6"
                                                        />

                                                        <line
                                                            x1="8"
                                                            y1="2"
                                                            x2="8"
                                                            y2="6"
                                                        />

                                                        <line
                                                            x1="3"
                                                            y1="10"
                                                            x2="21"
                                                            y2="10"
                                                        />
                                                    </svg>

                                                    {formatDate(g.date)}
                                                </span>

                                                <span className={styles.metaDot}>·</span>

                                                <span className={styles.metaTime}>
                                                    {formatTime(g.date)}
                                                </span>

                                                {g.words && (
                                                    <>
                                                        <span className={styles.metaDot}>
                                                            ·
                                                        </span>

                                                        <span className={styles.metaWords}>
                                                            {g.words} words
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Prompt preview */}
                                        <div className={styles.promptPreview}>
                                            <span className={styles.promptLabel}>
                                                Prompt:
                                            </span>

                                            {isOpen
                                                ? g.prompt
                                                : g.prompt.slice(0, 80) +
                                                (g.prompt.length > 80 ? "…" : "")}
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <span
                                                className={styles.toneBadge}
                                                style={{
                                                    background: tc.bg,
                                                    color: tc.color,
                                                }}
                                            >
                                                {tone}
                                            </span>

                                            <span className={styles.creditBadge}>
                                                <svg
                                                    width="11"
                                                    height="11"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    style={{ marginRight: 3 }}
                                                >
                                                    <polygon
                                                        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                                                        fill="#F59E0B"
                                                    />
                                                </svg>

                                                {g.credits} credits
                                            </span>

                                            <span className={styles.typeBadge}>
                                                {g.type === "article"
                                                    ? "Article"
                                                    : "Image"}
                                            </span>

                                            <span
                                                className={styles.expandHint}
                                                style={{ marginLeft: "auto" }}
                                            >
                                                {isOpen ? "▲ Less" : "▼ More"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className={styles.footer}>
                    Showing {filtered.length} of {mockGenerations.length} generations · CreatorAI
                </div>
            </div>
        </div>
    );
}
