
import { useState } from "react";
import Sidebar from "./Sidebar";
import "../../css/TitleGenerator.css"
import { authData } from "../../Context/ContextApi";

const categories = [
    { label: "General", value: "general" },
    { label: "Technology", value: "technology" },
    { label: "Business", value: "business" },
    { label: "Health", value: "health" },
    { label: "Lifestyle", value: "lifestyle" },
    { label: "Education", value: "education" },
    { label: "Travel", value: "travel" },
    { label: "Food", value: "food" },
];
export default function TitleGenerator() {
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("general");
    const [count, setCount] = useState(1);
    const [titles, setTitles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedAll, setCopiedAll] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState(null);

    const { setUser } = authData()
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const generate = async () => {
        if (!keyword.trim()) return;
        setLoading(true); setError(""); setTitles([]);
        try {
            let res = await fetch(`${BASE_URL}/api/generate-title`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    keyword,
                    count,
                    category
                })
            });
            res = await res.json();
            console.log("API Response:", res);
            if (res.success && Array.isArray(res.titles)) {
                setTitles(res.titles);
                setUser(prev => ({ ...prev, remainingLimit: res.remainingLimit }))
            } else {
                setError(res.message);
            }
        } catch {
            setError("Network error. Please check your connection.");
        } finally { setLoading(false); }
    };

    const copyAll = () => {
        navigator.clipboard.writeText(titles.join("\n"));
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    const copySingle = (idx, text) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    return (
        <>
            {/* <style>{styles}</style> */}
            <div className="db-root">
                <Sidebar />
                <div className="app-root">
                    {/* ══ MAIN ══ */}
                    <div className="main-area">
                        <h1 className="page-title">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9381ff" strokeWidth="2.2" strokeLinecap="round">
                                <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
                                <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
                            </svg>
                            AI Title Generator
                        </h1>

                        <div className="tg-grid">

                            {/* ── Config Card ── */}
                            <div className="config-card">
                                <div className="card-header">
                                    <div className="card-header-icon">
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                                            <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
                                            <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
                                        </svg>
                                    </div>
                                    <span className="card-title">Title Configuration</span>
                                </div>

                                {/* Keyword */}
                                <div>
                                    <div className="field-label">Keyword / Topic</div>
                                    <input
                                        className="keyword-input"
                                        placeholder="The future of artificial intelligence is..."
                                        value={keyword}
                                        onChange={e => setKeyword(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && generate()}
                                    />
                                </div>

                                {/* Count */}
                                <div>
                                    <div className="field-label">Number of Titles</div>
                                    <div className="count-row">
                                        <span className="count-label">How many titles?</span>
                                        <div className="count-controls">
                                            <button className="count-btn" onClick={() => setCount(c => Math.max(1, c - 1))}>−</button>
                                            <span className="count-val">{count}</span>
                                            <button className="count-btn" onClick={() => setCount(c => Math.min(15, c + 1))}>+</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div>
                                    <div className="field-label">Category</div>
                                    <div className="category-grid">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.value}
                                                className={`cat-btn ${category === cat.value ? "selected" : ""}`}
                                                onClick={() => setCategory(cat.value)}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button className="generate-btn" onClick={generate} disabled={loading || !keyword.trim()}>
                                    {loading ? (
                                        <><div className="spinner" /> Generating titles...</>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                                                <line x1="12" y1="2" x2="14" y2="10" />
                                                <line x1="14" y1="10" x2="22" y2="12" />
                                                <line x1="22" y1="12" x2="14" y2="14" />
                                                <line x1="14" y1="14" x2="12" y2="22" />
                                                <line x1="12" y1="22" x2="10" y2="14" />
                                                <line x1="10" y1="14" x2="2" y2="12" />
                                                <line x1="2" y1="12" x2="10" y2="10" />
                                                <line x1="10" y1="10" x2="12" y2="2" />
                                            </svg>
                                            Generate Titles
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* ── Output Card ── */}
                            <div className="output-card">
                                <div className="output-header">
                                    <div className="card-header" style={{ gap: 10 }}>
                                        <div className="card-header-icon">
                                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                                                <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
                                                <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
                                            </svg>
                                        </div>
                                        <span className="card-title">Generated Titles</span>
                                    </div>
                                    {titles.length > 0 && (
                                        <div className="output-meta">
                                            <span className="count-badge">✨ {titles.length} titles</span>
                                            <button className={`copy-all-btn ${copiedAll ? "copied" : ""}`} onClick={copyAll}>
                                                {copiedAll ? "✓ All Copied!" : "📋 Copy All"}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {error && <div className="error-msg">⚠️ {error}</div>}

                                {loading && (
                                    <div className="shimmer-list">
                                        {Array.from({ length: count > 8 ? 8 : count }).map((_, i) => (
                                            <div key={i} className="shimmer" style={{ height: 52, width: `${85 + (i % 3) * 5}%` }} />
                                        ))}
                                    </div>
                                )}

                                {!loading && titles.length === 0 && !error && (
                                    <div className="empty-output">
                                        <div className="empty-icon-wrap">
                                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9381ff" strokeWidth="1.8" strokeLinecap="round">
                                                <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
                                                <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
                                            </svg>
                                        </div>
                                        <div className="empty-text">Your titles will appear here</div>
                                        <div className="empty-sub">Enter a keyword and click "Generate Titles" to get started</div>
                                    </div>
                                )}

                                {!loading && titles.length > 0 && (
                                    <div className="titles-list">
                                        {titles.map((title, i) => (
                                            <div key={i} className="title-card">
                                                <div className="title-num">{i + 1}</div>
                                                <div className="title-text">{title}</div>
                                                <button
                                                    className={`title-copy-btn ${copiedIdx === i ? "copied-single" : ""}`}
                                                    onClick={() => copySingle(i, title)}
                                                    title="Copy this title"
                                                >
                                                    {copiedIdx === i ? (
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9381ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="9" y="9" width="13" height="13" rx="2" />
                                                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}