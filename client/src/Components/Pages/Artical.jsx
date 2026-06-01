import { useState, useRef } from "react";
import styles from "../../css/Article.module.css";
import Sidebar from "./Sidebar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { LogoIcon } from "../Profile/Icons/Icon";
import { lengths, tones } from "../../Data/article";
import { authData } from "../../Context/ContextApi";
import Plan from "../Pricing/Plan";

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
    const [planPopUp, setPlan] = useState(false)
    const articleRef = useRef(null);


    const { user, setUser } = authData()
    const BASE_URL = import.meta.env.VITE_BASE_URL
    const wordCount = article ? article.split(/\s+/).filter(Boolean).length : 0;


    const generate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setError("");
        setArticle("");

        const selectedLength = lengths.find(l => l.value === length);
        const wordCountMap = { short: 650, medium: 1000, long: 1400 };
        try {
            const res = await fetch(`${BASE_URL}/api/generate-article`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    prompt: `${topic}`,
                    length: wordCountMap[selectedLength.value],
                    tone: tone,
                    title: "article"
                })
            });
            const data = await res.json();
            if (data?.success && data?.content) {
                setArticle(data.content);
                setUser(prev => ({ ...prev, remainingLimit: data.remainingLimit }))
                return
            }
            if (user.remainingLimit === 0) {
                setPlan(true)
            }
            setError(data.message);

        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const copyText = () => {
        navigator.clipboard.writeText(article);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const downloadPDF = async () => {
        if (!article) return;
        const { default: jsPDF } = await import("jspdf");
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - margin * 2;
        let y = margin; // current Y position
        const addText = (text, fontSize, isBold = false, color = [30, 30, 30], lineHeightMul = 1.5) => {
            pdf.setFontSize(fontSize);
            pdf.setFont("helvetica", isBold ? "bold" : "normal");
            pdf.setTextColor(...color);
            const lines = pdf.splitTextToSize(text, contentWidth);
            const lineHeight = (fontSize * 0.352778) * lineHeightMul; // pt to mm
            lines.forEach(line => {
                if (y + lineHeight > pageHeight - margin) {
                    pdf.addPage();
                    y = margin;
                }
                pdf.text(line, margin, y);
                y += lineHeight;
            });
            y += lineHeight * 0.4;
        };
        const lines = article.split("\n");
        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed) {
                y += 3;
                return;
            }
            if (trimmed.startsWith("### ")) {
                y += 2;
                addText(trimmed.replace("### ", ""), 13, true, [20, 20, 20]);
            } else if (trimmed.startsWith("## ")) {
                y += 4;
                addText(trimmed.replace("## ", ""), 16, true, [10, 10, 10]);
            } else if (trimmed.startsWith("# ")) {
                y += 4;
                addText(trimmed.replace("# ", ""), 20, true, [0, 0, 0]);
                pdf.setDrawColor(100, 100, 100);
                pdf.setLineWidth(0.4);
                pdf.line(margin, y, pageWidth - margin, y);
                y += 5;
            } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                const bulletText = "•  " + trimmed.replace(/^[-*] /, "");
                addText(bulletText, 11, false, [50, 50, 50]);
            } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                addText(trimmed.replace(/\*\*/g, ""), 11, true, [30, 30, 30]);
            } else {
                const cleaned = trimmed.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
                addText(cleaned, 11, false, [50, 50, 50]);
            }
        });
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(9);
            pdf.setTextColor(150, 150, 150);
            pdf.text(
                `Page ${i} of ${totalPages}`,
                pageWidth / 2,
                pageHeight - 8,
                { align: "center" }
            );
        }
        const fileName = `article-${topic.slice(0, 30).replace(/\s+/g, "-")}-${Date.now()}.pdf`;
        pdf.save(fileName);
    };

    return (
        <>
            {/* <style>{styles}</style> */}
            <div className={styles.dbRoot}>
                <Sidebar />
                <div className={styles.awRoot}>
                    {planPopUp && <Plan closePlanPopUp={setPlan} />}
                    <h1 className={styles.awPageTitle}>
                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#9381ff"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                            <path d="M14 3v5h5" />
                            <line x1="9" y1="13" x2="15" y2="13" />
                            <line x1="9" y1="17" x2="13" y2="17" />
                            <path d="M16.5 11.5l2 2" />
                        </svg>AI Article Writer</h1>
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
                                            // onClick={downloadTxt}
                                            onClick={downloadPDF}
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
                                    <div className={styles.shimmer} style={{ height: 28, width: "60%" }} />
                                    <div className={styles.shimmer} style={{ height: 14, width: "100%" }} />
                                    <div className={styles.shimmer} style={{ height: 14, width: "95%" }} />
                                    <div className={styles.shimmer} style={{ height: 14, width: "88%" }} />
                                    <div className={styles.shimmer} style={{ height: 14, width: "92%" }} />
                                    <div className={styles.shimmer} style={{ height: 14, width: "80%" }} />
                                </div>
                            )}

                            {!loading && !article && !error && (
                                <div className={styles.emptyOutput}>
                                    <div className={styles.emptyIconWrap}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9381ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                                    ref={articleRef}
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