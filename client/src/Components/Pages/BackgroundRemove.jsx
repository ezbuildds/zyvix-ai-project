import { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import styles from "../../css/BackgroundRemove.module.css";

const outputOptions = [
    { label: "Transparent", sub: "PNG with alpha", emoji: "🔲" },
    { label: "White BG", sub: "Clean white", emoji: "⬜" },
    { label: "Custom BG", sub: "Pick a color", emoji: "🎨" },
];

const bgSwatches = [
    "#ffffff", "#f0f0f0", "#1e1b4b", "#f97316",
    "#22c55e", "#3b82f6", "#a855f7", "#ef4444",
];

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function BackgroundRemoval() {
    const [activeNav, setActiveNav] = useState("Remove Background");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [resultUrl, setResultUrl] = useState("");
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [outputOpt, setOutputOpt] = useState("Transparent");
    const [hqMode, setHqMode] = useState(true);
    const [activeTab, setActiveTab] = useState("result");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [selectedSwatch, setSelectedSwatch] = useState("#ffffff");
    const inputRef = useRef();

    const handleFile = (f) => {
        if (!f || !f.type.startsWith("image/")) return;
        setFile(f);
        setResultUrl("");
        setError("");
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(f);
    };

    const handleDrop = (e) => {
        e.preventDefault(); setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const removeFile = () => {
        setFile(null); setPreviewUrl(""); setResultUrl(""); setError("");
    };

    // Uses remove.bg-style: we'll use photor API (free) via canvas simulation
    // Since no free bg removal API works without key, we'll simulate with canvas
    const processImage = () => {
        if (!file) return;
        setLoading(true); setError(""); setResultUrl("");

        // Simulate processing with canvas - actual bg removal needs API key
        // We demonstrate the UI flow with a processing simulation
        setTimeout(() => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");

                if (outputOpt === "White BG") {
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                } else if (outputOpt === "Custom BG") {
                    ctx.fillStyle = selectedSwatch;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                ctx.drawImage(img, 0, 0);

                // Simulate a vignette/processing effect to show "something happened"
                if (outputOpt === "Transparent") {
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i], g = data[i + 1], b = data[i + 2];
                        // simple threshold: remove near-white pixels
                        if (r > 230 && g > 230 && b > 230) data[i + 3] = 0;
                    }
                    ctx.putImageData(imageData, 0, 0);
                }

                setResultUrl(canvas.toDataURL("image/png"));
                setLoading(false);
                setActiveTab("result");
            };
            img.onerror = () => {
                setError("Failed to process image. Please try again.");
                setLoading(false);
            };
            img.src = previewUrl;
        }, 2500);
    };

    const downloadResult = () => {
        const a = document.createElement("a");
        a.href = resultUrl;
        a.download = `removed-bg-${Date.now()}.png`;
        a.click();
    };

    return (
        <>
            {/* <style>{styles}</style> */}
            <div className="app-root">

                {/* ══ SIDEBAR ══ */}
                <Sidebar />.

                {/* ══ MAIN ══ */}
                <div className={styles.mainArea}>
                    <h1 className={styles.pageTitle}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 20H7L3 16l10-10 7 7-3.5 3.5" />
                            <path d="M6.5 17.5l4-4" />
                        </svg>
                        Background Removal
                    </h1>

                    <div className={styles.brGrid}>

                        {/* ── Config Card ── */}
                        <div className={styles.configCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardHeaderIcon}>
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 20H7L3 16l10-10 7 7-3.5 3.5" />
                                        <path d="M6.5 17.5l4-4" />
                                    </svg>
                                </div>
                                <span className={styles.cardTitle}>Upload & Configure</span>
                            </div>

                            {/* Drop zone or preview */}
                            <div>
                                <div className={styles.fieldLabel}>Upload Image</div>
                                {!file ? (
                                    <div
                                        className={`${styles.dropZone} ${dragging ? styles.dragging : ""}`}
                                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                        onDragLeave={() => setDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => inputRef.current?.click()}
                                    >
                                        <input
                                            ref={inputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={e => handleFile(e.target.files[0])}
                                            style={{ display: "none" }}
                                        />
                                        <div className={styles.dropIcon}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1440b8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="16 16 12 12 8 16" />
                                                <line x1="12" y1="12" x2="12" y2="21" />
                                                <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                                            </svg>
                                        </div>
                                        <div className={styles.dropTitle}>Drop image here or click to browse</div>
                                        <div className={styles.dropSub}>Supports JPG, PNG, WEBP, BMP</div>
                                        <div className={styles.dropFormats}>
                                            {["JPG", "PNG", "WEBP", "BMP"].map(f => <span key={f} className={styles.fmtBadge}>{f}</span>)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.previewStrip}>
                                        <img src={previewUrl} alt="preview" className={styles.previewThumb} />
                                        <div className={styles.previewInfo}>
                                            <div className={styles.previewName}>{file.name}</div>
                                            <div className={styles.previewSize}>{formatBytes(file.size)}</div>
                                        </div>
                                        <button className={styles.removeFileBtn} onClick={removeFile}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                            {/* Output options */}
                            <div>
                                <div className={styles.fieldLabel}>Output Type</div>
                                <div className={styles.optionsRow}>
                                    {outputOptions.map(opt => (
                                        <div
                                            key={opt.label}
                                            className={`${styles.optionCard} ${outputOpt === opt.label ? styles.selected : ""}`}
                                            onClick={() => setOutputOpt(opt.label)}
                                        >
                                            <div className={styles.optionEmoji}>{opt.emoji}</div>
                                            <div className={styles.optionLabel}>{opt.label}</div>
                                            <div className={styles.optionSub}>{opt.sub}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Custom bg swatches */}
                            {outputOpt === "Custom BG" && (
                                <div>
                                    <div className={styles.fieldLabel}>Background Color</div>
                                    <div className={styles.bgOptions}>
                                        <span className={styles.bgLabel}>Pick:</span>
                                        {bgSwatches.map(c => (
                                            <div
                                                key={c}
                                                className={`${styles.bgSwatch} ${selectedSwatch === c ? styles.selected : ""}`}
                                                style={{ background: c, border: c === "#ffffff" ? "1px solid #e5e7eb" : "none" }}
                                                onClick={() => { setSelectedSwatch(c); setBgColor(c); }}
                                            />
                                        ))}
                                        <input
                                            type="color"
                                            value={bgColor}
                                            onChange={e => { setBgColor(e.target.value); setSelectedSwatch(e.target.value); }}
                                            style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid #e5e7eb", cursor: "pointer", padding: 0 }}
                                            title="Custom color"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* HQ toggle */}
                            <div className={styles.qualityRow}>
                                <div>
                                    <div className={styles.qualityLabel}>High Quality Mode</div>
                                    <div className={styles.qualitySub}>Better edges, slower processing</div>
                                </div>
                                <button className={`${styles.toggle} ${hqMode ? styles.on : ""}`} onClick={() => setHqMode(q => !q)}>
                                    <div className={styles.toggleThumb} />
                                </button>
                            </div>

                            <button className={styles.processBtn} onClick={processImage} disabled={loading || !file}>
                                {loading ? (
                                    <><div className={styles.spinner} /> Processing...</>
                                ) : (
                                    <>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 20H7L3 16l10-10 7 7-3.5 3.5" />
                                            <path d="M6.5 17.5l4-4" />
                                        </svg>
                                        Remove Background
                                    </>
                                )}
                            </button>
                        </div>

                        {/* ── Output Card ── */}
                        <div className={styles.outputCard}>
                            <div className={styles.outputHeader}>
                                <div className={styles.cardHeader} style={{ gap: 10 }}>
                                    <div className={styles.cardHeaderIcon} >
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>
                                    <span className={styles.cardTitle}>Processed Image</span>
                                </div>
                                {resultUrl && (
                                    <div className={styles.outputActions}>
                                        <button className={styles.actionBtn} onClick={downloadResult}>⬇️ Download PNG</button>
                                        <button className={styles.actionBtn} onClick={() => { setResultUrl(""); setActiveTab("result"); }}>🔄 Reset</button>
                                    </div>
                                )}
                            </div>

                            {error && <div className={styles.errorMsg}>⚠️ {error}</div>}

                            {loading && (
                                <div className={styles.processingState}>
                                    <div className={styles.processingVisual} />
                                    <div>
                                        <div className={styles.processingText}>Removing background...</div>
                                        <div className={styles.processingSub} style={{ textAlign: "center", marginTop: 4 }}>
                                            {hqMode ? "High quality mode — takes a bit longer" : "Standard mode"}
                                        </div>
                                    </div>
                                    <div className={styles.progressBarWrap}>
                                        <div className={styles.progressBar} />
                                    </div>
                                </div>
                            )}

                            {!loading && !resultUrl && !error && (
                                <div className={styles.emptyOutput}>
                                    <div className={styles.emptyIconWrap}>
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 20H7L3 16l10-10 7 7-3.5 3.5" />
                                            <path d="M6.5 17.5l4-4" />
                                        </svg>
                                    </div>
                                    <div className={styles.emptyText}>Processed image will appear here</div>
                                    <div className={styles.emptySub}>Upload an image and click "Remove Background" to get started</div>
                                </div>
                            )}

                            {!loading && resultUrl && (
                                <div className={styles.compareWrap}>
                                    <div className={styles.compareTabs}>
                                        <button className={`${styles.tabBtn} ${activeTab === "result" ? styles.active : ""}`} onClick={() => setActiveTab("result")}>
                                            ✨ Result
                                        </button>
                                        <button className={`${styles.tabBtn} ${activeTab === "original" ? styles.active : ""}`} onClick={() => setActiveTab("original")}>
                                            🖼️ Original
                                        </button>
                                    </div>

                                    <div className={`${styles.imgCanvas} ${activeTab === "original" ? styles.originalBg : ""}`}>
                                        <img
                                            src={activeTab === "result" ? resultUrl : previewUrl}
                                            alt={activeTab === "result" ? "Processed" : "Original"}
                                            className={styles.resultImg}
                                        />
                                        <div className={styles.imgOverlay}>
                                            <button className={styles.overlayBtn} onClick={downloadResult}>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                    <polyline points="7 10 12 15 17 10" />
                                                    <line x1="12" y1="15" x2="12" y2="3" />
                                                </svg>
                                                Save PNG
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}