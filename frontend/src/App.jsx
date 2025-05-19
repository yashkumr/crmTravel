import React from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "./Routes/PrivateRoute.jsx";
import SuperAdminRoute from "./Routes/SuperAdminRoute.jsx";
import AdminRoute from "./Routes/AdminRoute.jsx";
import UserRoute from "./Routes/UserRoute.jsx";
import { useAuth } from "./context/Auth.jsx";
import SuperAdminDashboard from "./pages/AllAdmins/SuperAdmin/SuperAdminDashboard.jsx";
import AdminDashboard from "./pages/AllAdmins/Admin/AdminDashboard.jsx";
import UserDashboard from "./pages/User/UserDashboard.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";
import Home from "./pages/Home.jsx";
import Agents from "./pages/Agent/Agents.jsx";
import Brokers from "./pages/Broker/Brokers.jsx";
import AllAdmins from "./pages/AllAdmins/Admin/AllAdmins.jsx";
import FlightDeals from "./pages/Flight/FlightDeals.jsx";
import HotelDeals from "./pages/Hotel/HotelDeals.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AllSuperAdmin from "./pages/AllAdmins/SuperAdmin/AllSuperAdmin.jsx";
import AgentRegister from "./pages/Agent/AgentRegister.jsx";
import RegisterUsers from "./pages/AllAdmins/SuperAdmin/RegisterUsers.jsx";
import AdminRegister from "./pages/AllAdmins/Admin/AdminRegister.jsx";
import AllAgent from "./pages/Agent/AllAgent.jsx";
import SuperAdminRegister from "./pages/AllAdmins/SuperAdmin/SuperAdminRegister.jsx";
import AgentBooking from "./pages/Agent/AgentBooking.jsx";
import AdminBooking from "./pages/AllAdmins/Admin/AdminBooking.jsx";
import SuperAdminUserDashboard from "./pages/AllAdmins/SuperAdmin/SuperAdminUserDashboard.jsx";
import SpersonalDashboard from "./pages/AllAdmins/SuperAdmin/SpersonalDashboard.jsx";
import AadminRegistrationRequest from "./pages/AllAdmins/Admin/AadminRegistrationRequest.jsx";
import OtpLogin from "./pages/Auth/OtpLogin.jsx";
import Package from "./pages/packages/Package.jsx";
import BookingMails from "./pages/Flight/BookingMails.jsx";
import Car from "./pages/Cars/Car.jsx";
import BusinessQuery from "./pages/Business/BusinessQuery.jsx";
import BusinessDelas from "./pages/Business/BusinessDelas.jsx";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/zts-login" />}
        />
        <Route
          path="/zts-login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/zts-register" element={<Register />} />

        {/* Private Routes */}
        <Route
          path="/ztsPage/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route
                  path="dashboard/superAdmin"
                  element={
                    <SuperAdminRoute>
                      <SuperAdminUserDashboard />
                    </SuperAdminRoute>
                  }
                />
                <Route
                  path="dashboard/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="dashboard/user"
                  element={
                    <UserRoute>
                      <UserDashboard />
                    </UserRoute>
                  }
                />
                <Route path="otp-login" element={<OtpLogin />} />
                <Route path="agents" element={<Agents />} />
                <Route path="all-agents" element={<AllAgent />} />
                {/* <Route path="agent-booking" element={<AgentBooking />} /> */}
                <Route path="all-admins" element={<AllAdmins />} />
                <Route path="super-admin-dashboard" element={<SuperAdminDashboard />} />
                <Route path="super-admin-register" element={<SuperAdminRegister />} />
                <Route path="all-register-user" element={<RegisterUsers />} />
                <Route path="admin-register-request" element={<AadminRegistrationRequest />} />
                <Route path="admin-booking" element={<AdminBooking />} />
                <Route path="brokers" element={<Brokers />} />
                <Route path="flight-deals" element={<FlightDeals />} />
                <Route path="hotel-deals" element={<HotelDeals />} />
                <Route path="package" element={<Package />} />
                <Route path="car" element={<Car />} />
                <Route path="booking-mails" element={<BookingMails />} />

                <Route path="business-query" element={<BusinessQuery />} />
                <Route path="business-booking" element={<BusinessDelas />} />

              </Routes>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
