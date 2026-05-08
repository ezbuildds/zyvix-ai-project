import { useState } from "react";
import styles from "../../css/ManageAccount.module.css"
import ChangePassword from "./ChangePassword";
export default function SecurityTab({setChangePasswordModel}) {
    const items = [
        {
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
            ),
            label: "Password",
            sub: "Last changed 3 months ago",
            action: "Change",
            onClick: () => setChangePasswordModel(true),
            danger: false,
        },
        {
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            ),
            label: "Two-factor auth",
            sub: "Adds an extra layer of security",
            action: "Enable",
            onClick: () => console.log("Enable 2FA"),
            danger: false,
        },
        {
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
            ),
            label: "Active sessions",
            sub: "2 active devices",
            action: "Manage",
            onClick: () => console.log("Manage sessions"),
            danger: false,
        },
        {
            icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                </svg>
            ),
            label: "Delete account",
            sub: "Permanently remove your account",
            action: "Delete",
            onClick: () => console.log("Delete account"),
            danger: true,
        },
    ];

    return (
        <>
            {items.map((item, i) => (
                <div className={styles.sectionRow} key={i} style={{ paddingTop: i === 0 ? 0 : undefined }}>
                    <div className={styles.sectionLabel}>{item.label}</div>
                    <div className={styles.sectionValue}>
                        <div className={styles.securityItem}>
                            <div className={styles.securityLeft}>
                                <div className={styles.securityIconWrap}>{item.icon}</div>
                                <div>
                                    <div className={styles.securityLabel}>{item.label}</div>
                                    <div className={styles.securitySub}>{item.sub}</div>
                                </div>
                            </div>
                            <button onClick={item.onClick} className={`${styles.securityAction} ${item.danger ? styles.danger : ""}`}>{item.action}</button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}