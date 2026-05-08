import { useState } from "react";
import styles from "../../css/Article.module.css";
import Sidebar from "./Sidebar";
import { LogoIcon } from "../Profile/Icons/Icon";
const lengths = [
    { label: "Short (500-800 words)", value: "short", prompt: "Write a short article of around 500-800 words" },
    { label: "Medium (800-1200 words)", value: "medium", prompt: "Write a medium article of around 800-1200 words" },
    { label: "Long (1200+ words)", value: "long", prompt: "Write a long, comprehensive article of 1200+ words" },
];

const tones = [
    { label: "✍️ Professional", value: "professional" },
    { label: "🎯 Informative", value: "informative" },
    { label: "😊 Friendly", value: "friendly" },
    { label: "🔥 Persuasive", value: "persuasive" },
    { label: "🎓 Academic", value: "academic" },
    { label: "⚡ Casual", value: "casual" },
];

function renderMarkdown(text) {
    return text
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/^# (.+)$/gm, "<h1>$1</h1>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
        .replace(/\n\n/g, "</p><p>")
        .replace(/^(?!<[hul])/gm, "")
        .replace(/(.+)/s, "<p>$1</p>");
}

export default function Article() {
    const [topic, setTopic] = useState("");
    const [length, setLength] = useState("short");
    const [tone, setTone] = useState("professional");
    const [article, setArticle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const wordCount = article ? article.split(/\s+/).filter(Boolean).length : 0;

    const generate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setError("");
        setArticle("");

        const selectedLength = lengths.find(l => l.value === length);

        try {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1800,
                    messages: [{
                        role: "user",
                        content: `${selectedLength.prompt} about the following topic in a ${tone} tone. Use proper headings (##), subheadings (###), and well-structured paragraphs. Make it engaging and high quality.

Topic: ${topic}

Return only the article content, no preamble.`
                    }]
                })
            });

            const data = await res.json();
            if (data?.content?.[0]?.text) {
                setArticle(data.content[0].text);
            } else {
                setError("Could not generate article. Please try again.");
            }
        } catch (e) {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyText = () => {
        navigator.clipboard.writeText(article);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadTxt = () => {
        const blob = new Blob([article], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `article-${Date.now()}.txt`;
        a.click();
    };

    return (
        <>
            {/* <style>{styles}</style> */}
            <div className={styles.dbRoot}>
                <Sidebar />
                <div className={styles.awRoot}>
                    <h1 className={styles.awPageTitle}>
                       <LogoIcon/>
                        AI Article Writer
                    </h1>

                    <div className={styles.awGrid}>

                        {/* ── Config Card ── */}
                        <div className={styles.configCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardHeaderIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" />
                                    </svg>
                                </div>
                                <span className={styles.cardTitle}>Article Configuration</span>
                            </div>

                            <div>
                                <div className={styles.fieldLabel}>Article Topic</div>
                                <textarea
                                    className={styles.topicInput}
                                    placeholder="The future of artificial intelligence is..."
                                    value={topic}
                                    onChange={e => setTopic(e.target.value)}
                                />
                            </div>

                            <div>
                                <div className={styles.fieldLabel}>Article Length</div>
                                <div className={styles.lengthGroup}>
                                    {lengths.map(l => (
                                        <button
                                            key={l.value}
                                            className={`${styles.lengthBtn} ${length === l.value ? styles.selected : ""}`}
                                            onClick={() => setLength(l.value)}
                                        >
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className={styles.fieldLabel}>Writing Tone</div>
                                <div className={styles.toneGroup}>
                                    {tones.map(t => (
                                        <button
                                            key={t.value}
                                            className={`${styles.toneBtn} ${tone === t.value ? styles.selected : ""}`}
                                            onClick={() => setTone(t.value)}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                className={styles.generateBtn}
                                onClick={generate}
                                disabled={loading || !topic.trim()}
                            >
                                {loading ? (
                                    <><div className={styles.spinner} /> Generating article...</>
                                ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                        </svg>
                                        Generate Article
                                    </>
                                )}
                            </button>
                        </div>

                        {/* ── Output Card ── */}
                        <div className={styles.outputCard}>
                            <div className={styles.outputHeader}>
                                <div className={styles.cardHeader} style={{ gap: 10 }}>
                                    <div className={styles.cardHeaderIcon}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                    </div>
                                    <span className={styles.cardTitle}>Generated Article</span>
                                </div>

                                {article && (
                                    <div className={styles.outputActions}>
                                        <span className={styles.wordCountBadge}>📝 {wordCount} words</span>

                                        <button
                                            className={`${styles.actionBtn} ${copied ? styles.copied : ""}`}
                                            onClick={copyText}
                                        >
                                            {copied ? "✓ Copied!" : "📋 Copy"}
                                        </button>

                                        <button
                                            className={styles.actionBtn}
                                            onClick={downloadTxt}
                                        >
                                            ⬇️ Download
                                        </button>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className={styles.errorMsg}>⚠️ {error}</div>
                            )}

                            {loading && !article && (
                                <div className={styles.shimmerWrap}>
                                    <div className={styles.shimmer} style={{ height: 28, width: "60%" }} />
                                    <div className={styles.shimmer} style={{ height: 14, width: "100%" }} />
                                    <div className={styles.shimmer} style={{ height: 14, width: "95%" }} />
                                    <div className={styles.shimmer} style={{ height: 14, width: "88%" }} />
                                    <div className={styles.shimmer} style={{ height: 14, width: "92%" }} />
                                    <div className={styles.shimmer} style={{ height: 22, width: "45%", marginTop: 8 }} />
                                    <div className={styles.shimmer} style={{ height: 14, width: "100%" }} />
                                    <div className={styles.shimmer} style={{ height: 14, width: "80%" }} />
                                    <div className={styles.shimmer} style={{ height: 14, width: "96%" }} />
                                </div>
                            )}

                            {!loading && !article && !error && (
                                <div className={styles.emptyOutput}>
                                    <div className={styles.emptyIconWrap}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                        </svg>
                                    </div>
                                    <div className={styles.emptyText}>Your article will appear here</div>
                                    <div className={styles.emptySub}>
                                        Enter a topic and click "Generate Article" to get started
                                    </div>
                                </div>
                            )}

                            {article && (
                                <div
                                    className={styles.articleBody}
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(article) }}
                                />
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}