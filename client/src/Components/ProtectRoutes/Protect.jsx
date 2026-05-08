import { Navigate } from "react-router-dom";
import { authData } from "../../Context/ContextApi";

export default function ProtectedRoutes({ children }) {
    const { user, loading } = authData();
    if (loading) {
        return (
            <div className="p-loader-wrapper">
                <div className="p-spinner"></div>
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}