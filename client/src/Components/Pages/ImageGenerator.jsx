import { useState } from "react";
import Sidebar from "./Sidebar";
import styles from "../../css/ImageGenerator.module.css";
import { authData } from "../../Context/ContextApi";
import Plan from "../Pricing/Plan";
const imageStyles = [
    { label: "Realistic", value: "realistic, photorealistic, ultra detailed" },
    { label: "Ghibli", value: "studio ghibli style, anime, soft colors, whimsical" },
    { label: "Anime", value: "anime style, vibrant, detailed illustration" },
    { label: "Cartoon", value: "cartoon style, colorful, fun illustration" },
    { label: "Fantasy", value: "fantasy art, magical, epic, detailed digital painting" },
    { label: "3D Render", value: "3D render, octane render, realistic lighting, high quality" },
    { label: "Portrait", value: "portrait photography, bokeh, professional lighting, detailed" },
    { label: "Cyberpunk", value: "cyberpunk, neon lights, futuristic, dark atmosphere" },
];

const imageSizes = [
    { label: "Square", dims: "1024×1024", w: 1024, h: 1024 },
    { label: "Portrait", dims: "768×1024", w: 768, h: 1024 },
    { label: "Landscape", dims: "1024×768", w: 1024, h: 768 },
];

export default function ImageGenerator() {
    const [activeNav, setActiveNav] = useState("Generate Images");
    const [prompt, setPrompt] = useState("");
    const [style, setStyle] = useState(imageStyles[0].value);
    const [size, setSize] = useState(imageSizes[0]);
    const [isPublic, setIsPublic] = useState(false);
    const [imgUrl, setImgUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [planPopUp, setPlan] = useState(false)
    const [currentStyle, setCurrentStyle] = useState(imageStyles[0].label);

    const BASE_URL = import.meta.env.VITE_BASE_URL
    const { user, setUser } = authData()

    const generate = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError("");
        setImgUrl("");
        console.log(style);

        try {
            const response = await fetch(`${BASE_URL}/api/generate-image`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    style,
                    width: size.w,
                    height: size.h
                    // isPublic,
                }),
            });
            const data = await response.json();
            if (!data.success) {
                setError(data.message);
            }
            if (user.remainingLimit === 0) {
                setPlan(true)
                return
            }
            setImgUrl(data.imageUrl);
            setCurrentStyle(imageStyles.find((s) => s.value === style)?.label || style);
            setUser(prev => ({ ...prev, remainingLimit: data.remainingLimit }))
        } catch (err) {
            setError(err.message || "Image generation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const downloadImg = async () => {
        try {
            const res = await fetch(imgUrl);
            const blob = await res.blob();

            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `quickai-image-${Date.now()}.png`;
            a.click();
        } catch {
            window.open(imgUrl, "_blank");
        }
    };


    return (
        <>
            {/* <style>{styles}</style> */}
            <div className={styles.appRoot}>
                {/* ══ SIDEBAR ══ */}
                <Sidebar />
                {/* ══ MAIN ══ */}
                <div className={styles.mainArea}>
                    {planPopUp && <Plan closePlanPopUp={setPlan} />}
                    <h1 className={styles.pageTitle}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9381ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="3" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        AI Image Generator
                    </h1>

                    <div className={styles.igGrid}>

                        {/* ── Config Card ── */}
                        <div className={styles.configCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardHeaderIcon}>
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="3" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                </div>
                                <span className={styles.cardTitle}>Image Configuration</span>
                            </div>

                            <div>
                                <div className={styles.fieldLabel}>Describe Your Image</div>
                                <textarea
                                    className={styles.promptInput}
                                    placeholder="A futuristic cityscape at sunset, with flying cars and glowing neon signs..."
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                />
                            </div>

                            <div>
                                <div className={styles.fieldLabel}>Art Style</div>
                                <div className={styles.stylesGrid}>
                                    {imageStyles.map(s => (
                                        <button
                                            key={s.value}
                                            className={`${styles.styleBtn} ${style === s.value ? styles.selected : ""}`}
                                            onClick={() => setStyle(s.value)}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className={styles.fieldLabel}>Image Size</div>
                                <div className={styles.sizeGrid}>
                                    {imageSizes.map(s => (
                                        <button
                                            key={s.label}
                                            className={`${styles.sizeBtn} ${size.label === s.label ? styles.selected : ""}`}
                                            onClick={() => setSize(s)}
                                        >
                                            <div>{s.label}</div>
                                            <div className={styles.sizeDims}>{s.dims}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.toggleRow}>
                                <div>
                                    <div className={styles.toggleLabel}>Make image Public</div>
                                    <div className={styles.toggleSub}>Share with community gallery</div>
                                </div>
                                <button className={`${styles.toggle} ${isPublic ? styles.on : ""}`} onClick={() => setIsPublic(p => !p)}>
                                    <div className={styles.toggleThumb} />
                                </button>
                            </div>

                            <button className={styles.generateBtn} onClick={generate} disabled={loading || !prompt.trim()}>
                                {loading ? (
                                    <><div className={styles.spinner} /> Generating image...</>
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
                                        Generate Image
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
                                            <rect x="3" y="3" width="18" height="18" rx="3" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>
                                    <span className={styles.cardTitle}>Generated Image</span>
                                </div>

                                {imgUrl && (
                                    <div className={styles.outputActions}>
                                        <span className={styles.styleTag}>🎨 {currentStyle}</span>
                                        <button className={styles.actionBtn} onClick={downloadImg}>⬇️ Download</button>
                                        <button className={styles.actionBtn} onClick={generate}>🔄 Regenerate</button>
                                    </div>
                                )}
                            </div>

                            {error && <div className={styles.errorMsg}>⚠️ {error}</div>}

                            {loading && (
                                <div className={styles.imgSkeleton}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9381ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="3" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <span className={styles.skeletonText}>Creating your masterpiece...</span>
                                </div>
                            )}

                            {!loading && !imgUrl && !error && (
                                <div className={styles.emptyOutput}>
                                    <div className={styles.emptyIconWrap}>
                                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9381ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="3" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>
                                    <div className={styles.emptyText}>Your image will appear here</div>
                                    <div className={styles.emptySub}>Describe your image and click "Generate Image" to get started</div>
                                </div>
                            )}

                            {!loading && imgUrl && (
                                <div className={styles.imgResult}>
                                    <img src={imgUrl} alt="Generated" className={styles.genImage} />
                                    <div className={styles.imgOverlay}>
                                        <button className={styles.overlayBtn} onClick={downloadImg}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line x1="12" y1="15" x2="12" y2="3" />
                                            </svg>
                                            Save
                                        </button>
                                        <button className={styles.overlayBtn} onClick={generate}>
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="23 4 23 10 17 10" />
                                                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                                            </svg>
                                            Retry
                                        </button>
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