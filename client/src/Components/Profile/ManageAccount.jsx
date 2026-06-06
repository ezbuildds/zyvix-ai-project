import { LogoIcon } from "./Icons/Icon.jsx";
import styles from "../../css/ManageAccount.module.css"
import ProfileTab from "./ProfileTab.jsx";
import SecurityTab from "./SecurityTab.jsx";
import BillingTab from "./BillingTab.jsx";
import ChangePassword from "./ChangePassword.jsx";
import Forgot from "../Auth/Forgot.jsx";
import useLockScroll from "../../hooks/useLockScroll.js";
import { useState } from "react";
const tabs = [
    {
        id: "profile",
        label: "Profile",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 00-16 0" />
            </svg>
        ),
    },
    {
        id: "security",
        label: "Security",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
    },
    {
        id: "billing",
        label: "Billing",
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
            </svg>
        ),
    },
];

const tabTitles = { profile: "Profile details", security: "Security settings", billing: "Billing & usage" };

export default function ManageAccount({ openProfile,setPlanPopUp,openProfileModel }) {
    const [activeTab, setActiveTab] = useState("profile");
    const [showChangePasswordModel, setChangePasswordModel] = useState(false)
    const [showProfileForgotModel, setProfileForgotModel] = useState(false)
    useLockScroll()
    return (
        <div className={styles.pageShell}>
            {showChangePasswordModel && (<ChangePassword setChangePasswordModel={setChangePasswordModel} setProfileForgotModel={setProfileForgotModel} />)}
            {showProfileForgotModel && (<Forgot showProfileForgotModel={setProfileForgotModel} closeProfileForgotModel={setProfileForgotModel} />)}
            <div className={styles.modal}>
                {/* ── Sidebar ── */}
                <div className={styles.modalSidebar}>
                    <div className={styles.sidebarHeading}>
                        <h2>Account</h2>
                        <p>Manage your account info.</p>
                    </div>

                    <nav className={styles.sidebarNav}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`${styles.sidebarTab} ${activeTab === tab.id ? styles.active : ""
                                    }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <div className={styles.tabIconWrap}>{tab.icon}</div>
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className={styles.sidebarFooter}>
                        <div className={styles.sfLogo}>
                            Quick.ai
                        </div>

                        <div className={styles.sfSecure}>
                            <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            >
                                <rect x="3" y="11" width="18" height="11" rx="2" />
                                <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                            Secure
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className={styles.modalContent}>
                    <div className={styles.contentHeader}>
                        <h3 className={styles.contentTitle}>
                            {tabTitles[activeTab]}
                        </h3>

                        <button
                            className={styles.closeBtn}
                            onClick={() => openProfile(false)}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div className={styles.contentBody}>
                        {activeTab === "profile" && <ProfileTab />}
                        {activeTab === "security" && <SecurityTab setChangePasswordModel={setChangePasswordModel} />}
                        {activeTab === "billing" && <BillingTab setPlanPopUp={setPlanPopUp} />}
                    </div>
                </div>

            </div>
        </div>
    );
}