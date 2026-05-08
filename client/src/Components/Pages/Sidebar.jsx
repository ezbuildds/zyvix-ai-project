import { useState } from "react";
import "../../css/Dashboard.css"
import { NavLink, useNavigate } from "react-router-dom";
import { authData } from "../../Context/ContextApi";
import { toast } from 'react-toastify';
import { LogoIcon } from "../Profile/Icons/Icon";
// SVG Icons
const HomeIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);
const PenIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);
const HashIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round">
        <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
    </svg>
);
const ImageIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);
const EraserIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 20H7L3 16l10-10 7 7-3.5 3.5" /><path d="M6.5 17.5l4-4" />
    </svg>
);
const ScissorsIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
);
const DocIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);
const UsersIcon = ({ active }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);
const LogoutIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);


const navItems = [
    { label: "Dashboard", icon: HomeIcon, path: "/dashboard" },
    { label: "Write Article", icon: PenIcon, path: "/dashboard/artical" },
    { label: "Generate Titles", icon: HashIcon, path: "/dashboard/title-generator" },
    { label: "Generate Images", icon: ImageIcon, path: "/dashboard/image-generator" },
    { label: "Remove Background", icon: EraserIcon, path: "/dashboard/remove-bg" },
    { label: "Review Resume", icon: DocIcon, path: "/dashboard/resume" },
    { label: "Community", icon: UsersIcon, path: "/dashboard/community" },
];
export default function Sidebar() {
    const { user,setUser} = authData()
    const navigate = useNavigate()

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    async function handleLogout() {
        let res = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: "post",
            credentials: "include",
        })
        res = await res.json()
        console.log(res);
        if (!res.success) {
            toast.error(res.message)
            return
        }
        toast.success("Logout success")
        setUser(null)
        navigate("/")

    }
    return (
        <aside className="sidebar">

            {/* Logo */}
            <NavLink to="/" className="sidebar-logo">
            <LogoIcon/>
                Zyvix.ai
            </NavLink>

            {/* Profile */}
            <div className="sidebar-profile">
                <div className="avatar-lg">{user?.username.charAt(0).toUpperCase()}</div>
                <span className="profile-name">{user?.username}</span>
                <span className="plan-badge">💎 Free Plan</span>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map(({ label, icon: Icon, path }) => (
                    <NavLink
                        to={path}
                        end
                        key={label}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? "active" : ""}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon active={isActive} />
                                {label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom */}
            <div className="sidebar-bottom">
                <div className="avatar-sm">ai</div>
                <div className="bottom-info">
                    <div className="bottom-name">{user?.username}</div>
                    <div className="bottom-plan">Free Plan</div>
                </div>
                <button className="logout-btn" title="Logout" onClick={handleLogout}>
                    Logout
                    <LogoutIcon />
                </button>
            </div>

        </aside>
    );
}



