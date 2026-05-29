import { useState } from "react";
import styles from "../../css/Profile.module.css"
import { authData } from "../../Context/ContextApi";
import { ArrowIcon, ChevronIcon } from "./Icons/Icon";
import ManageAccount from "./ManageAccount";
import Logout from "../Auth/Logout";
const menuItems = [
    {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 00-16 0" />
            </svg>
        ),
        iconClass: "iconPurple",
        label: "My Profile",
        sub: "View & edit your info",
        path: "/user/profile",
    },
    {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
        ),
        iconClass: "iconGreen",
        label: "Billing & Plans",
        sub: "Manage your subscription",
        path: "/billing",
    },
    {
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
        ),
        iconClass: "iconAmber",
        label: "Notifications",
        sub: "Alerts & updates",
        path: "/notifications",
    },
];



export default function Profile({ openProfileModel }) {
    const [open, setOpen] = useState(false);
    const [showAccountModel, setAccountModel] = useState(false)
    const { user } = authData()
    return (
        <>
            {showAccountModel && <div className={styles.modalOverlay}>
                {/* <div className={styles.modalBox}> */}
                {/* </div> */}
                <ManageAccount openProfile={setAccountModel} />
            </div>}

            {!showAccountModel && <div className="demo-page">
                <div className="dropdown-wrapper">

                    {/* Trigger */}
                    <button className={styles.triggerBtn} onClick={() => setOpen(o => !o)}>
                        <div className={styles.triggerAvatar}>{user?.username?.charAt(0).toUpperCase()}</div>
                        <span className={styles.triggerName}>{user?.username}</span>
                        <span className={`${styles.triggerChevron} ${open ? styles.open : ""}`}>
                            <ChevronIcon />
                        </span>
                    </button>

                    {/* Dropdown */}
                    {open && (
                        <div className={styles.dropdownCard}>

                            {/* Profile header */}
                            <div className={styles.profileHeader}>
                                <div className={styles.profileAvatar}>
                                    {user?.username?.charAt(0).toUpperCase()}
                                    <span className={styles.onlineDot} />
                                </div>
                                <div className={styles.profileInfo}>
                                    <div className={styles.profileName}>{user?.username}</div>
                                    <div className={styles.profileEmail}>{user?.email}</div>
                                    <div className={styles.profileBadge}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#7c3aed" stroke="none">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                        Free Plan
                                    </div>
                                </div>
                            </div>

                            {/* Menu items */}
                            <div className={styles.menuSection}>
                                {menuItems.map((item, i) => (
                                    // <Link to={item.path} className={styles.Link}>
                                    // <button key={i} className={styles.menuItem} onClick={() => setOpen(false)} >
                                    <button key={i} className={styles.menuItem} onClick={() => { setOpen(false); if (item.label === "My Profile") { setAccountModel(true); } }}>
                                        <div className={`${styles.menuIconWrap} ${styles[item.iconClass]}`}>{item.icon}</div>
                                        <div className={styles.menuText}>
                                            <div className={styles.menuLabel}>{item.label}</div>
                                            <div className={styles.menuSub}>{item.sub}</div>
                                        </div>
                                        <span className={styles.menuArrow}><ArrowIcon /></span>
                                    </button>
                                    // </Link>
                                ))}

                                <div className={styles.menuDivider} />

                                {/* Sign out */}
                                <Logout openProfileModel={openProfileModel} setOpen={setOpen} />
                            </div>

                            {/* Footer */}
                            <div className={styles.dropdownFooter}>
                                <div className={styles.footerBrand}>
                                    Zyvix.ai
                                </div>
                                <div className={styles.footerSecure}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                    End-to-end encrypted
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>}

        </>
    );
}