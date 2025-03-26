import { Toaster } from "react-hot-toast";
import { Route, Routes, Navigate } from "react-router-dom";
import SuperAdminRoute from "./Routes/SuperAdminRoute.jsx";
import SuperAdminDashboard from "./pages/AllAdmins/SuperAdmin/SuperAdminDashboard.jsx";
import AdminRoute from "./Routes/AdminRoute.jsx";
import AdminDashboard from "./pages/AllAdmins/Admin/AdminDashboard.jsx";
import UserRoute from "./Routes/UserRoute.jsx";
import UserDashboard from "./pages/User/UserDashboard.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";
import Home from "./pages/Home.jsx";
import { useEffect, useState } from "react";
import { useAuth } from "./context/Auth.jsx";
import Agents from "./pages/Agent/Agents.jsx";
import Brokers from "./pages/Broker/Brokers.jsx";
import AllAdmins from "./pages/AllAdmins/Admin/AllAdmins.jsx";


function App() {

  const { isAuthenticated} = useAuth();

  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {

  //   const token = localStorage.getItem("auth");
  //   console.log(token);
  //   if (token) {
  //     setIsAuthenticated(true);
  //   } else {
  //     setIsAuthenticated(false);
  //   }
  // }, []);



  return (
    <>

      <Toaster />
      <Routes>

        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        {/* <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} /> */}
        <Route
          path="/login"
          element={!isAuthenticated ? (
            <Login />
          ) : (
            <Navigate to="/" />
          )}
        />

        {/* Admin Dashboard */}
        <Route path="/dashboard" element={<SuperAdminRoute />}>
          <Route path="superAdmin" element={<SuperAdminDashboard />} />

        </Route>

        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />

        </Route>

        <Route path="/dashboard" element={<UserRoute />}>
          <Route path="user" element={<UserDashboard />} />

        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/all-admins" element={<AllAdmins />} />

        <Route path="/brokers" element={<Brokers />} />
        <Route path="/all-brokers" element={<Brokers />} />



        {/* <Route path="/login" element={<Login />} /> */}


        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
