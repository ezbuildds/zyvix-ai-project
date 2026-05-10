import img from "../../assets/noun-ai-6480930.png";
import { useState } from "react";
import styles from "../../css/Dashboard.module.css"
import { Link, Outlet } from "react-router-dom";
import { authData } from "../../Context/ContextApi";
import Sidebar from "./Sidebar";
import { DiamondIcon, SparkleIcon, StarIcon } from "./icon/Icon";







// ── SVG Icons ──────────────────────────────────────────────
const GridIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="7" height="7" rx="1.5" fill="#2EAF78" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" fill="#2EAF78" opacity=".45" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" fill="#2EAF78" opacity=".45" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" fill="#2EAF78" opacity=".25" />
    </svg>
);

const PencilIcon = ({ color = "#3D6ED4" }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
            d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const ImageIcon = ({ color = "#D4900F" }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="1.8" />
        <circle cx="8.5" cy="8.5" r="1.5" fill={color} />
        <polyline points="21 15 16 10 5 21" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const BoltIcon = ({ color = "#6460E8" }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 3l3 7-5 4h5l-2 7 11-10h-6l3-8z" fill={color} stroke={color} strokeWidth=".5" strokeLinejoin="round" />
    </svg>
);

const BoltSmIcon = ({ color = "#F0C050" }) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={color} />
    </svg>
);

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9B9BB4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C4C4D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

// ── Data ───────────────────────────────────────────────────
const creations = [
    { id: 1, icon: "pencil", iconBg: "#EEF0FE", iconColor: "#4338CA", title: "Future of Artificial Intelligence", meta: "10 May 2026 · 800 words", tag: "Professional", tagClass: "tag-pro" },
    { id: 2, icon: "pencil", iconBg: "#E8F5F0", iconColor: "#1A7A52", title: "How to Learn Web Development Fast", meta: "9 May 2026 · 1200 words", tag: "Casual", tagClass: "tag-cas" },
    { id: 3, icon: "photo", iconBg: "#EAF0FD", iconColor: "#2755A8", title: "Futuristic city skyline at night", meta: "8 May 2026 · Image", tag: "Image", tagClass: "tag-img" },
    { id: 4, icon: "pencil", iconBg: "#FEF3E7", iconColor: "#A05D08", title: "Top 10 Marketing Strategies for 2026", meta: "7 May 2026 · 1000 words", tag: "Persuasive", tagClass: "tag-per" },
    { id: 5, icon: "pencil", iconBg: "#FCF0F8", iconColor: "#9A2E6E", title: "Beginner's Guide to Investing", meta: "6 May 2026 · 900 words", tag: "Informative", tagClass: "tag-inf" },
    { id: 6, icon: "pencil", iconBg: "#FCF0F8", iconColor: "#9A2E6E", title: "Beginner's Guide to Investing", meta: "6 May 2026 · 900 words", tag: "Informative", tagClass: "tag-inf" },
    { id: 6, icon: "pencil", iconBg: "#FCF0F8", iconColor: "#9A2E6E", title: "Beginner's Guide to Investing", meta: "6 May 2026 · 900 words", tag: "Informative", tagClass: "tag-inf" },
    { id: 6, icon: "pencil", iconBg: "#FCF0F8", iconColor: "#9A2E6E", title: "Beginner's Guide to Investing", meta: "6 May 2026 · 900 words", tag: "Informative", tagClass: "tag-inf" },
    { id: 6, icon: "pencil", iconBg: "#FCF0F8", iconColor: "#9A2E6E", title: "Beginner's Guide to Investing", meta: "6 May 2026 · 900 words", tag: "Informative", tagClass: "tag-inf" },
    { id: 6, icon: "pencil", iconBg: "#FCF0F8", iconColor: "#9A2E6E", title: "Beginner's Guide to Investing", meta: "6 May 2026 · 900 words", tag: "Informative", tagClass: "tag-inf" },
    { id: 6, icon: "pencil", iconBg: "#FCF0F8", iconColor: "#9A2E6E", title: "Beginner's Guide to Investing", meta: "6 May 2026 · 900 words", tag: "Informative", tagClass: "tag-inf" },
];

const quickActions = [
    { label: "New article", bg: "#EAF0FD", color: "#2755A8", icon: "pencil" },
    { label: "Generate image", bg: "#FEF3E7", color: "#A05D08", icon: "photo" },
    { label: "History", bg: "#EEF0FE", color: "#4338CA", icon: "clock" },
    { label: "Settings", bg: "#E8F5F0", color: "#1A7A52", icon: "settings" },
];

// tag color map
const tagColors = {
    "tag-pro": { background: "#EEF0FE", color: "#4338CA" },
    "tag-cas": { background: "#E8F5F0", color: "#1A7A52" },
    "tag-img": { background: "#EAF0FD", color: "#2755A8" },
    "tag-per": { background: "#FEF3E7", color: "#A05D08" },
    "tag-inf": { background: "#FCF0F8", color: "#9A2E6E" },
};

// stat card config
const statCards = [
    {
        iconBg: "#E8F5F0", icon: <GridIcon />,
        badgeBg: "#D4EEE6", badgeColor: "#1A7A52", badge: "+2 today",
        val: "0", valColor: "#0F4D34", label: "Total creations", labelColor: "#4DAA82",
    },
    {
        iconBg: "#EAF0FD", icon: <PencilIcon />,
        badgeBg: "#D5E3FA", badgeColor: "#2755A8", badge: "Articles",
        val: "0", valColor: "#1A3670", label: "Articles written", labelColor: "#5A82D6",
    },
    {
        iconBg: "#FEF3E7", icon: <ImageIcon />,
        badgeBg: "#FDEAC8", badgeColor: "#A05D08", badge: "Images",
        val: "0", valColor: "#6B3D05", label: "Images generated", labelColor: "#D4900F",
    },
    {
        iconBg: "#EEF0FE", icon: <BoltIcon />,
        badgeBg: "#DDE0FC", badgeColor: "#4338CA", badge: "Free",
        val: "Free", valColor: "#2A2480", valSize: 20, label: "Active plan", labelColor: "#7B76E0",
    },
];

export default function Dashboard() {
    const { user } = authData()
    const [search, setSearch] = useState("");

    const filtered = creations.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <>
            {/* <style>{styles}</style> */}
            <div className={styles.dbRoot}>
                {/* ── Sidebar ── */}
                <Sidebar />
                {/* ── Main ── */}
                <main className="main">
                    <div className={styles.page}>
                        <div className={styles.db}>

                            {/* Topbar */}
                            <div className={styles.topbar}>
                                <div className={styles.dbTitle}>Dashboard</div>

                                <div className={styles.topbarRight}>
                                    <div className={styles.searchbar}>
                                <SearchIcon />

                                <input
                                    className={styles.searchInput}
                                    type="text"
                                    placeholder="Search creations, articles, images…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <span className={styles.kbd}>⌘K</span>
                            </div>
                                    <div className={styles.creditsPill}>
                                        <BoltSmIcon color="#F0A830" />
                                        5 / 10 credits left
                                    </div>

                                    <button
                                        className={styles.upgradeBtn}
                                        onClick={() => setActive?.("Upgrade")}
                                    >
                                        Upgrade ↗
                                    </button>
                                </div>
                            </div>

                            {/* Search */}
                            

                            {/* Stats */}
                            <div className={styles.statsGrid}>
                                {statCards.map((card, i) => (
                                    <div
                                        key={i}
                                        className={styles.sc}
                                    >
                                        <div className={styles.scTop}>
                                            <div
                                                style={{ background: card.iconBg }}
                                                className={styles.scIco}
                                            >
                                                {card.icon}
                                            </div>

                                            <span
                                                style={{
                                                    background: card.badgeBg,
                                                    color: card.badgeColor
                                                }}
                                                className={styles.scBadge}
                                            >
                                                {card.badge}
                                            </span>
                                        </div>

                                        <div>
                                            <div
                                                style={{
                                                    fontSize: card.valSize || 26,
                                                    fontWeight: 500,
                                                    letterSpacing: "-.8px",
                                                    lineHeight: 1,
                                                    marginBottom: 3,
                                                    color: card.valColor
                                                }}
                                                className={styles.scValue}
                                            >
                                                {card.val}
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    lineHeight: 1.4,
                                                    color: card.labelColor
                                                }}
                                                className={styles.scLabel}
                                            >
                                                {card.label}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Main Row */}
                            <div className={styles.mainRow}>

                                {/* Recent Creations */}
                                <div className={styles.panel}>
                                    <div className={styles.panelHdr}>
                                        <span className={styles.panelTitle}>
                                            Recent creations
                                        </span>

                                        <button
                                            className={styles.viewallBtn}
                                        >
                                            View all <ArrowRightIcon />
                                        </button>
                                    </div>

                                    {filtered.length === 0 ? (
                                        <div
                                            style={{
                                                fontSize: 13,
                                                color: "#9B9BB4",
                                                padding: "16px 0",
                                                textAlign: "center"
                                            }}
                                            className={styles.noCreations}
                                        >
                                            No creations found
                                        </div>
                                    ) : (
                                        filtered.map((c, i) => (
                                            <div
                                                key={c.id}
                                                className={i === filtered.length - 1 ? styles.ciLast : styles.ci}
                                            >
                                                <div
                                                    style={{
                                                        background: c.iconBg,
                                                        color: c.iconColor
                                                    }}
                                                    className={styles.ciIcon}
                                                >
                                                    {c.icon === "photo" ? (
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
                                                            <rect x="3" y="3" width="18" height="18" rx="3" />
                                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                                            <polyline points="21 15 16 10 5 21" />
                                                        </svg>
                                                    ) : (
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
                                                            <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                                        </svg>
                                                    )}
                                                </div>

                                                <div className={styles.ciInfo}>
                                                    <div className={styles.ciTitle}>
                                                        {c.title}
                                                    </div>

                                                    <div className={styles.ciMeta}>
                                                        {c.meta}
                                                    </div>
                                                </div>

                                                <span
                                                    style={tagColors[c.tagClass]}
                                                    className={styles.ciTag}
                                                >
                                                    {c.tag}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Right Column */}
                                <div className={styles.rightCol}>

                                    {/* Plan Card */}
                                    <div className={styles.planCard}>
                                        <div className={styles.planDeco1} />
                                        <div className={styles.planDeco2} />

                                        <div className={styles.planTag}>
                                            Your plan
                                        </div>

                                        <div className={styles.planName}>
                                            <BoltSmIcon />
                                            Free plan
                                        </div>

                                        <div className={styles.planBarBg}>
                                            <div
                                                className={styles.planBarFill}
                                            />
                                        </div>

                                        <div className={styles.planCredits}>
                                            5 of 10 credits used
                                        </div>

                                        <div className={styles.planUpgrade}>
                                            <span
                                                className={styles.planUpgradeTxt}
                                            >
                                                Need more?
                                            </span>

                                            <button
                                                className={styles.planUpgradeBtn}
                                                onClick={() => setActive?.("Upgrade")}
                                            >
                                                Upgrade
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className={styles.quickActionsWrapper}>
                                        <div className={styles.qaTitle}>
                                            Quick actions
                                        </div>

                                        <div className={styles.qaList}>
                                            {quickActions.map((qa, i) => (
                                                <button
                                                    key={i}
                                                    className={styles.qaItem}
                                                    onClick={() => setActive?.(qa.label)}
                                                >
                                                    <div
                                                        style={{ background: qa.bg }}
                                                        className={styles.qaIco}
                                                    >
                                                        {qa.icon === "pencil" && (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={qa.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                                            </svg>
                                                        )}

                                                        {qa.icon === "photo" && (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={qa.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <rect x="3" y="3" width="18" height="18" rx="3" />
                                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                                <polyline points="21 15 16 10 5 21" />
                                                            </svg>
                                                        )}

                                                        {qa.icon === "clock" && (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={qa.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <polyline points="12 6 12 12 16 14" />
                                                            </svg>
                                                        )}

                                                        {qa.icon === "settings" && (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={qa.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="12" cy="12" r="3" />
                                                                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    <span
                                                        className={styles.qaLabel}
                                                    >
                                                        {qa.label}
                                                    </span>

                                                    <ChevronRightIcon />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>

        </>
    );
}