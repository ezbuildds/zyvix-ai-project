import { useState } from "react";
import styles from "../../css/sidebar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { authData } from "../../Context/ContextApi";
import { toast } from "react-toastify";
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
    const { user, setUser } = authData();
    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    async function handleLogout() {
        let res = await fetch(`${BASE_URL}/api/auth/logout`, {
            method: "post",
            credentials: "include",
        });
        res = await res.json();
        console.log(res);

        if (!res.success) {
            toast.error(res.message);
            return;
        }

        toast.success("Logout success");
        setUser(null);
        navigate("/");
    }
    return (
        <aside className={styles.sidebar}>
            {/* Logo */}
            <NavLink to="/" className={styles.sidebarLogo}>
                Zyvix.ai
            </NavLink>

            {/* Profile */}
            <div className={styles.sidebarProfile} >
                <div className={styles.avatarLg}>
                    {user?.username.charAt(0).toUpperCase()}
                </div>

                <span className={styles.profileName}>
                    {user?.username}
                </span>

                <span className={styles.planBadge}>
                    💎 Free Plan
                </span>
            </div>

            {/* Navigation */}
            <nav className={styles.sidebarNav}>
                {navItems.map(({ label, icon: Icon, path }) => (
                    <NavLink
                        to={path}
                        end
                        key={label}
                        className={({ isActive }) =>
                            `${styles.navItem} ${isActive ? styles.active : ""}`
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
            <div className={styles.sidebarBottom}>
                <div className={styles.avatarSm}>ai</div>

                <div className={styles.bottomInfo}>
                    <div className={styles.bottomName}>{user?.username}</div>
                    <div className={styles.bottomPlan}>Free Plan</div>
                </div>

                <button
                    className={styles.logoutBtn}
                    title="Logout"
                    onClick={handleLogout}
                >
                    Logout
                    <LogoutIcon />
                </button>
            </div>
        </aside>
    );
}