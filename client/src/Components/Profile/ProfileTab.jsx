import { authData } from "../../Context/ContextApi";
import styles from "../../css/ManageAccount.module.css"
import { DotsIcon, GoogleIcon } from "./Icons/Icon";
export default function ProfileTab() {
    const { user } = authData()
    const userSince = new Date(user.createAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric"
    });
    return (
        <>
            {/* Profile */}
            <div className={styles.sectionRow}>
                <div className={styles.sectionLabel}>Profile</div>
                <div className={styles.sectionValue}>
                    <div className={styles.profileRow}>
                        <div className={styles.userAvatar}>
                            {user?.username.charAt(0).toUpperCase()}
                            <span className={styles.avatarOnline} />
                        </div>
                        <div className={styles.userMeta}>
                            <div className={styles.userName}>{user?.username}</div>
                            {/* <div className={styles.userHandle}>@aidev</div> */}
                            <div className={styles.userSince}>Member since {userSince}</div>
                        </div>
                        <button className={styles.updateBtn}>Update profile</button>
                    </div>
                </div>
            </div>

            {/* Email */}
            <div className={styles.sectionRow}>
                <div className={styles.sectionLabel}>Email addresses</div>
                <div className={styles.sectionValue}>
                    <div className={styles.emailItem}>
                        <div className={styles.emailLeft}>
                            <div className={styles.emailDot} />
                            <span className={styles.emailAddr}>{user?.email}</span>
                            <span className={styles.primaryBadge}>Primary</span>
                        </div>
                        <button className={styles.dotsBtn}><DotsIcon /></button>
                    </div>

                    <button className={styles.addBtn}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add email address
                    </button>
                </div>
            </div>

            {/* Connected */}
            <div className={styles.sectionRow}>
                <div className={styles.sectionLabel}>Connected accounts</div>
                <div className={styles.sectionValue}>
                    <div className={styles.connectedItem}>
                        <div className={styles.connectedLeft}>
                            <div className={styles.serviceIcon}><GoogleIcon /></div>
                            <div className={styles.serviceInfo}>
                                <div className={styles.serviceName}>Google</div>
                                <div className={styles.serviceEmail}>aidev402@gmail.com</div>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span className={styles.connectedBadge}>✓ Connected</span>
                            <button className={styles.dotsBtn}><DotsIcon /></button>
                        </div>
                    </div>

                    <button className={styles.addBtn}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Connect account
                    </button>
                </div>
            </div>
        </>
    );
}