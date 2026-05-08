import img from "../../assets/noun-ai-6480930.png";
import { useState } from "react";
import "../../css/Dashboard.css"
import { Link, Outlet } from "react-router-dom";
import { authData } from "../../Context/ContextApi";
import Sidebar from "./Sidebar";
import { DiamondIcon, SparkleIcon, StarIcon } from "./icon/Icon";

export default function Dashboard() {
    const { user } = authData()

    return (
        <>
            {/* <style>{styles}</style> */}
            <div className="db-root">
                {/* ── Sidebar ── */}
                <Sidebar />
                {/* ── Main ── */}
                <main className="main">
                    <h1 className="main-title">Dashboard</h1>

                    {/* Stats */}
                    <div className="stats-row">
                        <div className="stat-card">
                            <div>
                                <div className="stat-label">Total Creations</div>
                                <div className="stat-value">0</div>
                            </div>
                            <div className="stat-icon icon-blue-g"><StarIcon /></div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <div className="stat-label">Active Plan</div>
                                <div className="stat-value" style={{ fontSize: 22 }}>Free</div>
                            </div>
                            <div className="stat-icon icon-pink-g"><DiamondIcon /></div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <div className="stat-label">Articles Written</div>
                                <div className="stat-value">0</div>
                            </div>
                            <div className="stat-icon icon-green-g">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <div className="stat-label">Images Generated</div>
                                <div className="stat-value">0</div>
                            </div>
                            <div className="stat-icon icon-indigo-g">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Recent Creations */}
                    <div>
                        <div className="section-header">
                            <span className="section-title">Recent Creations</span>
                            <button className="view-all">View all →</button>
                        </div>
                        <div className="empty-state">
                            <div className="empty-icon"><SparkleIcon /></div>
                            <div className="empty-title">No creations yet</div>
                            <div className="empty-sub">Start creating amazing content with our AI-powered tools.</div>
                            <button className="start-btn" onClick={() => setActive("Write Article")}>
                                Start Creating ✨
                            </button>
                        </div>
                    </div>
                </main>
            </div>

        </>
    );
}