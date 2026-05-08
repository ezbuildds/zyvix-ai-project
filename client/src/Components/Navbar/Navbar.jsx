
import { authData } from "../../Context/ContextApi";
import { useEffect, useState } from "react";
import Profile from "../Profile/Profile";
import { LogoIcon } from "../Profile/Icons/Icon";

export default function Navbar({ openSignupModel}) {
    const [showProfileModel, setProfileModel] = useState(false)
    const { user } = authData()
    useEffect(() => {
        if (user) {
            setProfileModel(true)
            openSignupModel(false)
        }
    }, [user])
    return (
        <>
            <nav className="navbar">
                <div className="logo">
                    <LogoIcon />
                    Zyvix.ai
                </div>
                {!showProfileModel && <button className="nav-btn" onClick={() => openSignupModel(true)}>Create Account →</button>}
                {showProfileModel && <Profile openProfileModel={setProfileModel}/>}
            </nav>
        </>
    )
}