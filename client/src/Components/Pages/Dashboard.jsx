import { useState, useEffect } from "react";
import styles from "../../css/Dashboard.module.css";
import Sidebar from "./Sidebar";
import { authData } from "../../Context/ContextApi";
import { BoltSmIcon, CommunityIcon, CreditIcon, TotalGenerateIcon } from "./icon/Icon";

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

const toneColors = {
    professional:  { bg: "#EEF0FE", color: "#4338CA" },
    casual:        { bg: "#E8F5F0", color: "#1A7A52" },
    persuasive:    { bg: "#FEF3E7", color: "#A05D08" },
    informative:   { bg: "#FCF0F8", color: "#9A2E6E" },
    photorealistic:{ bg: "#E8F0FE", color: "#1A56A5" },
    abstract:      { bg: "#F0EEF8", color: "#6B42C4" },
    friendly:      { bg: "#E8F5F0", color: "#1A7A52" },
    academic:      { bg: "#EEF0FE", color: "#4338CA" },
};

const TYPE_CONFIG = {
    article: {
        label: "Article",
        badgeBg: "#E0F2FE",
        badgeColor: "#0369A1",
        getMeta: (g) => `${g.tone || ""} · ${g.words || ""} words`,
    },
    image: {
        label: "Image",
        badgeBg: "#FCE7F3",
        badgeColor: "#9D174D",
        getMeta: (g) => g.style || "Generated image",
    },
    title: {
        label: "Titles",
        badgeBg: "#EDE9FE",
        badgeColor: "#6D28D9",
        getMeta: (g) => g.count ? `${g.count} titles generated` : "Titles generated",
    },
    resume: {
        label: "Resume",
        badgeBg: "#CCFBF1",
        badgeColor: "#0F766E",
        getMeta: (g) => g.score ? `Score: ${g.score}` : "Resume reviewed",
    },
    removebg: {
        label: "removeBg",
        badgeBg: "#FEF3C7",
        badgeColor: "#B45309",
        getMeta: (g) => g.meta?.originalName || "Background removed",
    },
};

export default function ContentDashboard() {
    const [search, setSearch]     = useState("");
    const [filter, setFilter]     = useState("all");
    const [expanded, setExpanded] = useState(null);
    const [historyData, setHistory] = useState([]);
    const { user } = authData();

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => { fetchHistory(); }, []);

    async function fetchHistory() {
        try {
            let res = await fetch(`${BASE_URL}/api/dashboard`, { credentials: "include" });
            res = await res.json();
            if (res.success) setHistory(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const filtered = historyData.filter((g) => {
        const matchSearch =
            g.type?.toLowerCase().includes(search.toLowerCase()) ||
            g.prompt?.toLowerCase().includes(search.toLowerCase()) ||
            g.meta?.originalName?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || g.type?.toLowerCase() === filter;
        return matchSearch && matchFilter;
    });

    const countByType = (type) => historyData.filter((g) => g.type?.toLowerCase() === type).length;

    return (
        <div className={styles.dbRoot}>
            <Sidebar />

            <div className={styles.root}>
                <div className={styles.grain} />

                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.logoMark}>
                            <span className={styles.logoAnim}>
                                <BoltSmIcon color="#F0A830" />
                            </span>
                        </div>
                        <div>
                            <div className={styles.appName}>Dashboard</div>
                            <div className={styles.appTagline}>Your generation history</div>
                        </div>
                    </div>
                    <div className={styles.hamburger}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className={styles.creditBox}>
                        <div className={styles.creditsPill}>
                            <span className={styles.boltAnim}><BoltSmIcon color="#F0A830" /></span>
                            {user?.remainingLimit} / {user?.totalLimit} credits left
                        </div>
                        <button className={styles.upgradeBtn}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#1A1A2E" />
                            </svg>
                            Upgrade Plan
                        </button>
                    </div>
                </header>

                <div className={styles.statsRow}>
                    {[
                        {
                            sub: "Total Generated",
                            value: historyData.length,
                            accent: "#6366F1",
                            bg: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
                            icon: <TotalGenerateIcon />
                        },
                        {
                            sub: "Community",
                            value: countByType("community"),
                            accent: "#F43F5E",
                            bg: "linear-gradient(135deg, #FFE4E6 0%, #FECDD3 100%)",
                            icon: <CommunityIcon />
                        },
                        {
                            value: historyData.reduce((acc, item) => acc + (item.creditsUsed || 0), 0),
                            sub: `${user?.remainingLimit || 0} left`,
                            accent: "#10B981",
                            bg: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
                            icon: <CreditIcon />
                        },
                    ].map((s, i) => (
                        <div key={i} className={styles.statCard}>
                            <div />
                            <div style={{ background: s.bg, color: s.accent }} className={styles.statIcon}>{s.icon}</div>
                            <div style={{ color: s.accent }} className={styles.statValue}>{s.value}</div>
                            <div className={styles.statSub}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.controls}>
                    <div className={styles.searchWrap}>
                        <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
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
                        {[
                            { key: "all",      label: "All" },
                            { key: "article",  label: "✦ Articles" },
                            { key: "image",    label: "◈ Images" },
                            { key: "title",    label: "❋ Titles" },
                            { key: "resume",   label: "▣ Resume" },
                            { key: "removebg", label: "◎ Background" },
                        ].map((f) => {
                            const count = f.key === "all" ? historyData.length : countByType(f.key);
                            return (
                                <button
                                    key={f.key}
                                    onClick={() => setFilter(f.key)}
                                    className={`${styles.filterBtn} ${filter === f.key ? styles.filterBtnActive : ""}`}
                                >
                                    {f.label}
                                    <span className={styles.filterCount}>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.list}>
                    {filtered.length === 0 ? (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                    <line x1="11" y1="8" x2="11" y2="14" />
                                    <line x1="8" y1="11" x2="14" y2="11" />
                                </svg>
                            </div>
                            <div className={styles.emptyText}>No generations found</div>
                            <div className={styles.emptySub}>Try adjusting your search or filter</div>
                        </div>
                    ) : (
                        filtered.map((g) => {
                            const config = TYPE_CONFIG[g.type?.toLowerCase()] || TYPE_CONFIG.article;
                            const tone   = g.tone?.toLowerCase() || g.style?.toLowerCase();
                            const tc     = toneColors[tone] || { bg: "#F1F5F9", color: "#64748B" };
                            const isOpen = expanded === g._id;
                            const displayText = g.prompt || g.meta?.originalName || "N/A";

                            return (
                                <div
                                    key={g._id}
                                    className={`${styles.card} ${isOpen ? styles.cardOpen : ""}`}
                                    onClick={() => setExpanded(isOpen ? null : g._id)}
                                >
                                    <div className={styles.cardBody}>
                                        <div className={styles.cardTop}>
                                            <div className={styles.cardTitle}>{displayText}</div>
                                            <div className={styles.cardMeta}>
                                                <span className={styles.metaDate}>
                                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                                        <line x1="16" y1="2" x2="16" y2="6" />
                                                        <line x1="8" y1="2" x2="8" y2="6" />
                                                        <line x1="3" y1="10" x2="21" y2="10" />
                                                    </svg>
                                                    {formatDate(g.createdAt)}
                                                </span>
                                                <span className={styles.metaDot}>·</span>
                                                <span className={styles.metaTime}>{formatTime(g.createdAt)}</span>
                                                {g.words && (
                                                    <>
                                                        <span className={styles.metaDot}>·</span>
                                                        <span className={styles.metaWords}>{g.words} words</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.promptPreview}>
                                            <span className={styles.promptLabel}>
                                                {g.prompt ? "Prompt: " : "File: "}
                                            </span>
                                            {isOpen
                                                ? displayText
                                                : displayText.slice(0, 80) + (displayText.length > 80 ? "…" : "")
                                            }
                                        </div>

                                        <div className={styles.cardFooter}>
                                            {g.tone && (
                                                <span className={styles.toneBadge} style={{ background: tc.bg, color: tc.color }}>
                                                    {g.tone}
                                                </span>
                                            )}
                                            <span className={styles.creditBadge}>
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ marginRight: 3 }}>
                                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#F59E0B" />
                                                </svg>
                                                {g.creditsUsed} credits
                                            </span>
                                            <span className={styles.typeBadge} style={{ background: config.badgeBg, color: config.badgeColor }}>
                                                {config.label}
                                            </span>
                                            <span className={styles.expandHint} style={{ marginLeft: "auto" }}>
                                                {isOpen ? "▲ Less" : "▼ More"}
                                            </span>
                                        </div>

                                        {isOpen && (
                                            <div className={styles.expandedContent}>
                                                {g.type?.toLowerCase() === "image" || g.type?.toLowerCase() === "removebg" ? (
                                                    g.meta?.imageUrl ? (
                                                        <img
                                                            src={g.meta.imageUrl}
                                                            alt={g.prompt || "image"}
                                                            style={{ width: "100%", borderRadius: 8, marginTop: 10 }}
                                                        />
                                                    ) : (
                                                        <p style={{ color: "#94A3B8", fontSize: 13 }}>No preview available</p>
                                                    )
                                                ) : g.type?.toLowerCase() === "title" ? (
                                                    <ul style={{ paddingLeft: 16, marginTop: 8 }}>
                                                        {g.meta?.titles?.map((t, i) => (
                                                            <li key={i} style={{ fontSize: 13, color: "#334155", marginBottom: 4 }}>{t}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p style={{ fontSize: 13, color: "#64748B", marginTop: 8, lineHeight: 1.6 }}>
                                                        {g.prompt}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className={styles.footer}>
                    Showing {historyData.length} of {historyData.length} generations · Zyvix.ai
                </div>
            </div>
        </div>
    );
}