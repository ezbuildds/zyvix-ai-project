import { useEffect, useState } from "react";
import styles from "../../css/sidebar.module.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
    // { label: "Review Resume", icon: DocIcon, path: "/dashboard/resume" },
    { label: "Community", icon: UsersIcon, path: "/dashboard/community" },
];
const bottomNavItems = navItems.slice(0, 4);
export default function Sidebar() {
    const { user, setUser } = authData();
    const navigate = useNavigate();
    const location = useLocation();
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        setDrawerOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = drawerOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [drawerOpen]);

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
        <>
            <button className={styles.menuToggleBtn} onClick={() => setDrawerOpen(true)} aria-label="Menu kholo">
                <span />
                <span />
                <span />
            </button>

            {drawerOpen && (<div className={styles.sidebarOverlay} onClick={() => setDrawerOpen(false)} />)}

            <aside className={`${styles.sidebar} ${drawerOpen ? styles.open : ""}`}>
                <NavLink to="/" className={styles.sidebarLogo}>
                    Zyvix.ai
                </NavLink>

                <div className={styles.sidebarProfile}>
                    <div className={styles.avatarLg}>
                        {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <span className={styles.profileName}>
                        {user?.username}
                    </span>
                    <span className={styles.planBadge}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L14.5 9.5H22L16 14.5L18.5 22L12 17.5L5.5 22L8 14.5L2 9.5H9.5L12 2Z"
                                fill="var(--p)" stroke="var(--p)" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                        {`${user.plan.charAt(0).toUpperCase()}${user.plan.slice(1)}`} plan
                    </span>
                </div>

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

                <div className={styles.sidebarBottom}>
                    <div className={styles.avatarSm}>ai</div>
                    <div className={styles.bottomInfo}>
                        <div className={styles.bottomName}>{user?.username}</div>
                        <div className={styles.bottomPlan}>Free Plan</div>
                    </div>
                    <button className={styles.logoutBtn} title="Logout" onClick={handleLogout}>
                        Logout
                        <LogoutIcon />
                    </button>
                </div>
            </aside>

            <nav className={styles.bottomNavBar}>
                {navItems.slice(0, 4).map(({ label, icon: Icon, path }) => (
                    <NavLink
                        to={path}
                        end
                        key={label}
                        className={({ isActive }) =>
                            `${styles.bottomNavItem} ${isActive ? styles.bottomNavItemActive : ""}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon active={isActive} />
                                <span>{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
                <button className={styles.bottomNavItem} onClick={() => setDrawerOpen(true)}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <circle cx="12" cy="5" r="1" fill="currentColor" />
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                        <circle cx="12" cy="19" r="1" fill="currentColor" />
                    </svg>
                    <span>More</span>
                </button>
            </nav>
        </>
    );
}