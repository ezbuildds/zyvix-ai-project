import { Outlet } from "react-router-dom";
export default function DashboardLayout() {
    return (
        <div>
            {/* <Sidebar /> */}
            <Outlet />  {/* child routes yaha render honge */}
        </div>
    );
}