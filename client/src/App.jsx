import { Route, Routes } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import Dashboard from "./Components/Pages/Dashboard";
import Article from "./Components/Pages/Artical";
import TitleGenerator from "./Components/Pages/TitleGenerator";
import ImageGenerator from "./Components/Pages/ImageGenerator";
import BackgroundRemoval from "./Components/Pages/BackgroundRemove";
import { ToastContainer } from 'react-toastify';
import ContextProvider from "./Context/ContextApi";
import ProtectedRoutes from "./Components/ProtectRoutes/Protect";
import DashboardLayout from "./Components/DashboardLayout";
import PageNotFound from "./Components/Pages/PageNotFound";
import SuccessPayment from "./Components/Pricing/SuccessPayment";
import TransactionHistory from "./Components/Transaction/TransactionHistory";

export default function App() {
  return (
    <>
      <ContextProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Protected Dashboard group */}
          <Route path="/dashboard" element={<ProtectedRoutes><DashboardLayout /></ProtectedRoutes>}>
            <Route index element={<Dashboard />} />
            <Route path="artical" element={<Article />} />
            <Route path="title-generator" element={<TitleGenerator />} />
            <Route path="image-generator" element={<ImageGenerator />} />
            <Route path="remove-bg" element={<BackgroundRemoval />} />
            <Route path="transactions" element={<TransactionHistory />} />
          </Route>
          <Route path="/payment/success" element={<SuccessPayment />} />
          <Route path="*" element={<PageNotFound/>} />
        </Routes>
        <ToastContainer
          // position="top-right"
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
          closeButton={false}
          newestOnTop={true}
          toastStyle={{
            width: "200px",
            minHeight: "40px",
            padding: "6px 10px",
            fontSize: "14px",
            borderRadius: "8px"
          }}
        />
      </ContextProvider>
    </>
  )
}