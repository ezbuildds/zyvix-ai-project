import { authData } from "../../Context/ContextApi";
import { useEffect, useState, memo } from "react";
import Profile from "../Profile/Profile";
import { LogoIcon } from "../Profile/Icons/Icon";
import styles from "../Navbar/navbar.module.css"
import { FaCoins } from "react-icons/fa";

function Navbar({ openSignupModel }) {
    const [showProfileModel, setProfileModel] = useState(false)
    const { user } = authData()
    console.log(user);

    const freeCredits = user?.remainingLimit 

    useEffect(() => {
        if (user) {
            setProfileModel(true)
            openSignupModel(false)
        }
    }, [user])

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    <LogoIcon />
                    Zyvix.ai
                </div>
                <div className={styles.navRight}>
                    {user && (
                        <div className={styles.creditBox}>
                            <div className={styles.coinIcon}>
                                <FaCoins />
                            </div>
                            <div className={styles.creditContent}>
                                <span className={styles.creditLabel}>
                                    Credits
                                </span>
                                <span className={styles.creditValue}>
                                    {freeCredits}
                                </span>
                            </div>
                        </div>
                    )}
                    {!showProfileModel && <button className={styles.navBtn} onClick={() => openSignupModel(true)}>Create Account →</button>}
                    {showProfileModel && <Profile openProfileModel={setProfileModel} />}
                </div>
            </nav>
        </>
    )
}

export default memo(Navbar);