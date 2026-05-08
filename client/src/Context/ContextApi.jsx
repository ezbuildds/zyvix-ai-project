import { createContext, useContext, useEffect, useState } from "react"
export const userData = createContext()
export default function ContextProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState()
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        getProfileData()
    }, [])
    async function getProfileData() {
        try {
            setLoading(true)
            let res = await fetch(`${BASE_URL}/api/users/profile`, {
                credentials: "include"
            })
            res = await res.json()
            if (res.success) {
                setUser(res.data)
            }
        } catch (error) {
            console.log(error.message)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <userData.Provider value={{ user, setUser, loading }}>
                {children}
            </userData.Provider>
        </>
    )
}
export const authData = () => useContext(userData)