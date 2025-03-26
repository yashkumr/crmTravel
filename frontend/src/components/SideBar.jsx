import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";



const SideBar = () => {
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [activeTab, setActiveTab] = useState(""); // Track the active main tab

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const mainTabs = [
        {
            name: "Admins",
            path: "/admins",
            subTabs: [
                { name: "All Admins", path: "/all-admins" },
                { name: "Register Admin", path: "/register-admin" },
                { name: "Admin Booking", path: "/admin-booking" },
            ],
        },
        {
            name: "Agents",
            path: "/agents",
            subTabs: [
                { name: "All Agents", path: "/all-agents" },
                { name: "Register Agent", path: "/register-agent" },
                { name: "Agent Booking", path: "/agent-booking" },
            ],
        },
        {
            name: "Brokers",
            path: "/brokers",
            subTabs: [
                { name: "All Brokers", path: "/all-brokers" },
                { name: "Register Broker", path: "/register-broker" },
                { name: "Broker Booking", path: "/broker-booking" },
            ],
        },
    ];

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div>
                <button
                    className={`${isSidebarVisible ? "hide1" : "show1"}`}
                    onClick={toggleSidebar}
                >
                    <RxHamburgerMenu />
                </button>

                {isSidebarVisible && (
                    <div
                        className="bg-light p-3"
                        style={{ position: "relative", width: "250px", minHeight: "100vh" }}
                    >
                        <ul className="list-unstyled">
                            {mainTabs.map((tab) => (
                                <li key={tab.name} className="mb-3">
                                    <div
                                        className={`text-decoration-none ${activeTab === tab.name ? "text-primary" : "text-dark"}`}
                                        onClick={() => setActiveTab(activeTab === tab.name ? "" : tab.name)}
                                    >
                                        {tab.name}
                                    </div>

                                    {/* Render sub-tabs only if the current main tab is active */}

                                    {activeTab === tab.name && (
                                        <ul className="list-unstyled pl-3 mt-2">
                                            {tab.subTabs.map((sub) => (
                                                <li key={sub.name} className="mb-2">
                                                    <NavLink
                                                        to={sub.path}
                                                        className={({ isActive }) =>
                                                            `text-decoration-none ${isActive ? "text-success" : "text-dark"}`
                                                        }
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideBar;
