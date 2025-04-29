import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useFlightDeals } from "../context/FlightDealsContext.jsx";

import io from "socket.io-client"; 
import toast from "react-hot-toast";
const socket = io("http://localhost:8000/"); 
 const STATUS_NEW_BOOKING = "newBooking"

const SideBar = () => {

     const { flightDeals,setFlightDeals} = useFlightDeals();
      const [filteredDeals, setFilteredDeals] = useState(flightDeals);
     const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [activeTab, setActiveTab] = useState("");
    const location = useLocation();

    const userRole = localStorage.getItem("auth");
    const parsedUserRole = JSON.parse(userRole);
    const userRoleName = parsedUserRole?.user?.role;

    useEffect(() => {
        const matchedTab = mainTabs.find(tab => tab.subTabs.some(sub => sub.path === location.pathname));
        setActiveTab(matchedTab ? matchedTab.name : "");
    }, [location.pathname]);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    // Define base tabs
    let mainTabs = [
        {
            name: "Agents",
            path: "/",
            subTabs: [
                { name: "All Agents", path: "/ztsPage/all-agents" },

                { name: "Agent Booking", path: "/agent-booking" },
            ],
        },
    ];

    if (userRoleName === "superadmin") {
        mainTabs.unshift(

            {
                name: "SuperAdmin",
                path: "/",
                subTabs: [
                    { name: "Dashboard", path: "/ztsPage/super-admin-dashboard" },
                    { name: "Register", path: "/ztsPage/super-admin-register" },
                    { name: "Ziipl Team", path: "/ztsPage/all-register-user" },
                    { name: "Otp Access", path: "/ztsPage/otp-login" },
                ],
            },
            {
                name: "Admins",
                path: "/",
                subTabs: [
                    { name: "All Admins", path: "/ztsPage/all-admins" },
                    { name: "Admin Booking", path: "/ztsPage/admin-booking" },
                    { name: "Registration Request", path: "/ztsPage/admin-register-request" },
                    { name: "Otp Access", path: "/ztsPage/otp-login" },
                ],
            }

        );
    } else if (userRoleName === "admin") {
        mainTabs.unshift({
            name: "Admins",
            path: "/",
            subTabs: [
                { name: "All Admins", path: "/ztsPage/all-admins" },
                { name: "Admin Booking", path: "/ztsPage/admin-booking" },
                { name: "Registration Request", path: "/ztsPage/admin-register-request" },
                { name: "Otp Access", path: "/ztsPage/otp-login" },
            ],
        });
    }

      useEffect(() => {
        // Listen for real-time updates
        socket.on('newFlightAdded', (data) => {
    
          if (data.success) {
            setFlightDeals((prevDeals) => [data.data, ...prevDeals]);
            setFilteredDeals((prevDeals) => [data.data, ...prevDeals]);
            toast.success(data.message);
          }
        });
        return () => {
          socket.off('newFlightAdded');
        };
      }, []);

      const pendingBookings = flightDeals.filter(
        (deal) => deal.status === STATUS_NEW_BOOKING
      ).length;


    return (
        <div className="d-flex bg-light">
            <div>
                <button
                    className={`${isSidebarVisible ? "hide1" : "show1"}`}
                    onClick={toggleSidebar}
                >
                    <RxHamburgerMenu />
                </button>

                {isSidebarVisible && (
                    <div
                        className="p-3"
                        style={{ position: "relative", width: "250px", minHeight: "100vh" }}
                    >

                        

                        <NavLink to="/" className="text-decoration-none text-dark fw-bold mb-4 d-block">
                            <p>Home</p>
                        </NavLink>

                        <ul className="list-unstyled">
                            {mainTabs.map((tab) => (
                                <li key={tab.name} className="mb-3">
                                    <NavLink to="/"
                                        className={`text-decoration-none ${activeTab === tab.name ? "text-primary fw-bold" : "text-dark"}`}
                                        onClick={() => setActiveTab(activeTab === tab.name ? "" : tab.name)}
                                    >
                                        {tab.name}
                                    </NavLink>

                                    {activeTab === tab.name && (
                                        <ul className="list-unstyled pl-3 mt-2">
                                            {tab.subTabs.map((sub) => (
                                                <li key={sub.name} className="mb-2">
                                                    <NavLink
                                                        to={sub.path}
                                                        className={({ isActive }) => `text-decoration-none ${isActive ? "text-success fw-bold" : "text-dark"}`}
                                                    >
                                                        {sub.name}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <NavLink
                            to="/ztsPage/flight-deals"
                            className={`text-decoration-none d-flex align-items-center justify-content-between ${location.pathname === "/ztsPage/flight-deals" ? "text-primary fw-bold" : "text-dark"} mt-4`}
                        >
                            <span>Flight Booking</span>
                            <span className="badge bg-danger ms-2">{pendingBookings > 0 ? pendingBookings : ""}</span>
                        </NavLink>

                        <NavLink
                            to="/ztsPage/hotel-deals"
                            className={`text-decoration-none ${location.pathname === "/ztsPage/hotel-deals" ? "text-primary fw-bold" : "text-dark"} mt-4 d-block`}
                        >
                            <p>Hotel Booking</p>
                        </NavLink>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideBar;