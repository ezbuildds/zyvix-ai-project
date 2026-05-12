import { useState, useEffect } from "react";
import styles from "../../css/Dashboard.module.css";
import Sidebar from "./Sidebar";
import { authData } from "../../Context/ContextApi";
import { BoltSmIcon } from "./icon/Icon";

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

const toneColors = {
    professional: { bg: "#EEF0FE", color: "#4338CA" },
    casual: { bg: "#E8F5F0", color: "#1A7A52" },
    persuasive: { bg: "#FEF3E7", color: "#A05D08" },
    informative: { bg: "#FCF0F8", color: "#9A2E6E" },
    photorealistic: { bg: "#E8F0FE", color: "#1A56A5" },
    abstract: { bg: "#F0EEF8", color: "#6B42C4" },
};

export default function ContentDashboard() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [expanded, setExpanded] = useState(null);
    const [historyData, setHistory] = useState([]);
    const { user } = authData();

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        fetchHistory();
    }, []);

    async function fetchHistory() {
        try {
            let res = await fetch(`${BASE_URL}/api/dashboard`, {
                credentials: "include",
            });

            res = await res.json();

            if (res.success) {
                setHistory(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const filtered = historyData.filter((g) => {
        const matchSearch =
            g.title?.toLowerCase().includes(search.toLowerCase()) ||
            g.prompt?.toLowerCase().includes(search.toLowerCase());

        const matchFilter =
            filter === "all" || g.title?.toLowerCase() === filter;

        return matchSearch && matchFilter;
    });

    const articleCount = historyData.filter(
        (g) => g.title?.toLowerCase() === "article"
    ).length;

    const imageCount = historyData.filter(
        (g) => g.title?.toLowerCase() === "image"
    ).length;

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
                            <span className={styles.logoAnim}>
                                <BoltSmIcon color="#F0A830" />
                            </span>
                        </div>

                        <div>
                            <div className={styles.appName}>CreatorAI</div>
                            <div className={styles.appTagline}>
                                Your generation history
                            </div>
                        </div>
                    </div>

                    {/* Credit Bar */}
                    <div className={styles.creditBox}>
                        <div className={styles.creditsPill}>
                            <span className={styles.boltAnim}>
                                <BoltSmIcon color="#F0A830" />
                            </span>

                            {user?.remainingLimit} / {user?.totalLimit} credits
                            left
                        </div>

                        <button className={styles.upgradeBtn}>
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <polygon
                                    points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                                    fill="#1A1A2E"
                                />
                            </svg>

                            Upgrade Plan
                        </button>
                    </div>
                </header>

                {/* ── Stats Row ── */}
                <div className={styles.statsRow}>
                    {[
                        {
                            label: "Total Generated",
                            value: historyData.length,
                            sub: "All time",
                            icon: "⬡",
                            accent: "#6366F1",
                            bg: "#EEF2FF",
                        },
                        {
                            label: "Articles Written",
                            value: articleCount,
                            sub: "AI Generated",
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
                            label: "Images Created",
                            value: imageCount,
                            sub: "High quality",
                            icon: "◈",
                            accent: "#F59E0B",
                            bg: "#FEF3C7",
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
                            label: "Images Created",
                            value: imageCount,
                            sub: "High quality",
                            icon: "◈",
                            accent: "#F59E0B",
                            bg: "#FEF3C7",
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
                            value:
                                historyData.reduce(
                                    (acc, item) =>
                                        acc + (item.creditsUsed || 0),
                                    0
                                ),
                            sub: `${user?.remainingLimit || 0} left`,
                            icon: "⚡",
                            accent: "#10B981",
                            bg: "#D1FAE5",
                        },
                    ].map((s, i) => (
                        <div key={i} className={styles.statCard}>
                            <div
                                style={{
                                    background: s.bg,
                                    color: s.accent,
                                }}
                                className={styles.statIcon}
                            >
                                {s.icon}
                            </div>

                            <div
                                style={{ color: s.accent }}
                                className={styles.statValue}
                            >
                                {s.value}
                            </div>

                            <div className={styles.statLabel}>
                                {s.label}
                            </div>

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
                                className={`${styles.filterBtn} ${filter === f
                                    ? styles.filterBtnActive
                                    : ""
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
                            const tone =
                                g.tone?.toLowerCase() ||
                                g.style?.toLowerCase();

                            const tc = toneColors[tone] || {
                                bg: "#F1F5F9",
                                color: "#64748B",
                            };

                            const isOpen = expanded === g._id;

                            return (
                                <div
                                    key={g._id}
                                    className={`${styles.card} ${isOpen ? styles.cardOpen : ""
                                        }`}
                                    onClick={() =>
                                        setExpanded(
                                            isOpen ? null : g._id
                                        )
                                    }
                                >
                                    {/* Type pill */}
                                   

                                    <div className={styles.cardBody}>
                                        <div className={styles.cardTop}>
                                            <div className={styles.cardTitle}>
                                                {g.prompt}
                                            </div>

                                            <div className={styles.cardMeta}>
                                                <span
                                                    className={
                                                        styles.metaDate
                                                    }
                                                >
                                                    <svg
                                                        width="11"
                                                        height="11"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="#94A3B8"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        style={{
                                                            marginRight: 4,
                                                        }}
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

                                                    {formatDate(
                                                        g.createdAt
                                                    )}
                                                </span>

                                                <span
                                                    className={styles.metaDot}
                                                >
                                                    ·
                                                </span>

                                                <span
                                                    className={
                                                        styles.metaTime
                                                    }
                                                >
                                                    {formatTime(
                                                        g.createdAt
                                                    )}
                                                </span>

                                                {g.words && (
                                                    <>
                                                        <span
                                                            className={
                                                                styles.metaDot
                                                            }
                                                        >
                                                            ·
                                                        </span>

                                                        <span
                                                            className={
                                                                styles.metaWords
                                                            }
                                                        >
                                                            {g.words} words
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Prompt preview */}
                                        <div
                                            className={
                                                styles.promptPreview
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.promptLabel
                                                }
                                            >
                                                Prompt:
                                            </span>

                                            {isOpen
                                                ? g.prompt
                                                : g.prompt.slice(0, 80) +
                                                (g.prompt.length > 80
                                                    ? "…"
                                                    : "")}
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <span
                                                className={
                                                    styles.toneBadge
                                                }
                                                style={{
                                                    background: tc.bg,
                                                    color: tc.color,
                                                }}
                                            >
                                                {g.tone}
                                            </span>

                                            <span
                                                className={
                                                    styles.creditBadge
                                                }
                                            >
                                                <svg
                                                    width="11"
                                                    height="11"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    style={{
                                                        marginRight: 3,
                                                    }}
                                                >
                                                    <polygon
                                                        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
                                                        fill="#F59E0B"
                                                    />
                                                </svg>

                                                {g.creditsUsed} credits
                                            </span>

                                            <span
                                                className={styles.typeBadge}
                                            >
                                                {g.title}
                                            </span>

                                            <span
                                                className={
                                                    styles.expandHint
                                                }
                                                style={{
                                                    marginLeft: "auto",
                                                }}
                                            >
                                                {isOpen
                                                    ? "▲ Less"
                                                    : "▼ More"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className={styles.footer}>
                    Showing {filtered.length} of {historyData.length} generations
                    · CreatorAI
                </div>
            </div>
        </div>
    );
}