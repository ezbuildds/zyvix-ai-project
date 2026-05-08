import { useNavigate } from "react-router-dom";
import styles from "../../css/Profile.module.css"
import { toast } from 'react-toastify';
import { authData } from "../../Context/ContextApi";
import { ArrowIcon } from "../Profile/Icons/Icon";
export default function Logout({ setOpen, openProfileModel }) {
    const { setUser } = authData()
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
        openProfileModel(false)
        toast.success(res.message)
        setUser(null)
        navigate("/")

    }
    return (
        <>
            {/* Sign out */}
            <button className={`${styles.menuItem} ${styles.signout}`} onClick={() => { setOpen(false); handleLogout() }} >
                <div className={`${styles.menuIconWrap} ${styles.iconRose}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </div>
                <div className={styles.menuText}>
                    <div className={styles.menuLabel}>Sign Out</div>
                    <div className={styles.menuSub}>See you next time 👋</div>
                </div>
                <span className={styles.menuArrow}><ArrowIcon /></span>
            </button>
        </>
    )
}