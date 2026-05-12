import { useState } from "react";
import "../../css/sidebar.css"
import { NavLink, useNavigate } from "react-router-dom";
import { authData } from "../../Context/ContextApi";
import { toast } from 'react-toastify';
import { DocIcon, EraserIcon, HashIcon, HomeIcon, ImageIcon, LogoutIcon, PenIcon, UsersIcon } from "./icon/Icon";
// SVG Icons



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



