import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useFlightDeals } from "../context/FlightDealsContext.jsx";
import { useHotelDeals } from "../context/HotelDealsContext.jsx";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8000/");

const SideBar = () => {
  const { flightDeals, setFlightDeals } = useFlightDeals();
  const { hotelDeals, setHotelDeals } = useHotelDeals();
  const initialPendingCount = flightDeals.filter(
    (deal) => deal.status === "newBooking"
  ).length;
  const [pendingBookings, setPendingBookings] = useState(initialPendingCount);
  const [bookingMails, setBookingMails] = useState([]);
  const [originalBookingMails, setOriginalBookingMails] = useState([]); // Store the original data
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [activeSubTab, setActiveSubTab] = useState(""); // NEW
  const location = useLocation();

  const userRole = localStorage.getItem("auth");
  const parsedUserRole = JSON.parse(userRole);
  const userRoleName = parsedUserRole?.user?.role;

  // Sidebar visibility toggle
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    // Update pendingBookings whenever flightDeals changes
    const newPendingCount = flightDeals.filter(
      (deal) => deal.status === "newBooking"
    ).length;
    setPendingBookings(newPendingCount);
  }, [flightDeals]);

  useEffect(() => {
    const fetchBookingMails = async () => {
      try {
        const res = await axios.get("/api/v1/flights/get-booking-mails");

        if (res.data.success) {
          setBookingMails(res.data.combinedData);
          setOriginalBookingMails(res.data.combinedData); // Save the original data
        } else {
          console.error("Failed to fetch booking mails:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching booking mails:", error);
      }
    };

    fetchBookingMails();
  }, []);

  const uniqueValues = useMemo(() => {
    return Array.from(
      new Set(
        bookingMails.map((mailData) =>
          JSON.stringify({ url: mailData?.webUrl, mail: mailData?.webMail })
        )
      )
    )
      .map((item) => JSON.parse(item))
      .filter((item) => item.url || item.mail);
  }, [bookingMails]);

  useEffect(() => {
    const handleNewFlightAdded = (data) => {
      if (data.success) {
        setFlightDeals((prevDeals) => {
          const updatedDeals = [data.data, ...prevDeals];

          setPendingBookings((prevCount) => {
            const newPendingCount = updatedDeals.filter(
              (deal) => deal.status === "newBooking"
            ).length;
            return newPendingCount;
          });

          return updatedDeals;
        });
      }
    };

    const handleNewHotelAdded = (data) => {
      if (data?.success) {
        setHotelDeals((prevDeals) => {
          const updatedDeals = [data.data, ...prevDeals];
          return updatedDeals;
        });
      }
    };

    socket.on("newFlightAdded", handleNewFlightAdded);
    socket.on("newHotelAdded", handleNewHotelAdded);

    return () => {
      socket.off("newFlightAdded", handleNewFlightAdded);
    };
  }, [socket, setFlightDeals, setHotelDeals]);

  const newFaresWayBookings = flightDeals.filter(
    (deal) => deal.status === "newBooking" && deal.webUrl === "faresway.com"
  ).length;

  const newTravelowaysBooking = flightDeals.filter(
    (deal) => deal.status === "newBooking" && deal.webUrl === "traveloways.com"
  ).length;

  const newBusinessBookings = flightDeals.filter(
    (deal) =>
      deal.status === "newBooking" && deal.webUrl === "businessclassflyers.com"
  ).length;

  const mainTabs = useMemo(() => {
    let tabs = [
      {
        name: "Agents",
        path: "/",
        subTabs: [{ name: "All Agents", path: "/ztsPage/all-agents" }],
      },
    ];
   
    tabs.push({
      name: (
        <span>
          Create PNR
        </span>
      ),
      path: "/",
      subTabs: [
        { name: "flight", path: "/ztsPage/create-flight-booking" },
        // { name: "hotel", path: "/ztsPage/create-hotel-booking" },
      ],
    });

     if(userRoleName === "superadmin" || userRoleName === "admin") {
      tabs.push({
        name: "PNRS",
        path: "/",
        subTabs:[
          { name: "Flight PNR", path: "/ztsPage/flight-pnr" },
        ]
      });
    }

    tabs.push({
      name: (
        <span>
          Business Flyfairs
          {newBusinessBookings > 0 && (
            <span className="badge bg-danger ms-2">{newBusinessBookings}</span>
          )}
        </span>
      ),

      path: "/",
      subTabs: [
        {
          name: (
            <span>
              Business Query
              {/* {flightData && flightData.length > 0 && (
                <span className="badge bg-danger ms-2">
                  {flightData.length}
                </span>
              )} */}
            </span>
          ),
          path: "/ztsPage/business-query",
        },
        {
          name: (
            <span>
              Booking
              {newBusinessBookings > 0 && (
                <span className="badge bg-danger ms-2">
                  {newBusinessBookings}
                </span>
              )}
            </span>
          ),
          path: "/ztsPage/business-booking",
        },
      ],
    });

    tabs.push({
      name: (
        <span>
          Traveloways
          {newTravelowaysBooking > 0 && (
            <span className="badge bg-danger ms-2">
              {newTravelowaysBooking}
            </span>
          )}
        </span>
      ),

      path: "/",
      subTabs: [{ name: "Booking", path: "/ztsPage/traveloways-booking" }],
    });

    tabs.push({
      name: (
        <span>
          FaresWay
          {newFaresWayBookings > 0 && (
            <span className="badge bg-danger ms-2">{newFaresWayBookings}</span>
          )}
        </span>
      ),
      path: "/",
      subTabs: [{ name: "Booking", path: "/ztsPage/faresway-booking" }],
    });

    // Add bookingMailsTab only if uniqueValues is populated
    if (uniqueValues.length > 0) {
      tabs.push({
        name: "Deal's Mails",
        path: "/",
        subTabs: uniqueValues.map((value, index) => ({
          name: value.url ? value.url.replace(".com", "") : `Mail ${index + 1}`,
          path: value.url
            ? `/ztsPage/booking-mails?url=${encodeURIComponent(value.url)}`
            : "#",
        })),
      });
    }

    if (userRoleName === "superadmin") {
      tabs.unshift(
        {
          name: "SuperAdmin",
          path: "/",
          subTabs: [
            { name: "Dashboard", path: "/ztsPage/super-admin-dashboard" },
            { name: "Register", path: "/ztsPage/super-admin-register" },
            {
              name: "Registration Request",
              path: "/ztsPage/all-register-user",
            },
            { name: "Otp Access", path: "/ztsPage/otp-login-superadmin" },
            { name: "Reduce Price", path: "/ztsPage/reduce-price-superadmin" },
            { name: "Source & Dest", path: "/ztsPage/src-dest" },
          ],
        },
        {
          name: "Admins",
          path: "/",
          subTabs: [
            { name: "All Admins", path: "/ztsPage/all-admins" },
            // { name: "Admin Booking", path: "/ztsPage/admin-booking" },
            {
              name: "Registration Request",
              path: "/ztsPage/admin-register-request",
            },
            { name: "Otp Access", path: "/ztsPage/otp-login" },
          ],
        }
      );
    } else if (userRoleName === "admin") {
      tabs.unshift({
        name: "Admins",
        path: "/",
        subTabs: [
          { name: "All Admins", path: "/ztsPage/all-admins" },
          { name: "Admin Booking", path: "/ztsPage/admin-booking" },
          {
            name: "Registration Request",
            path: "/ztsPage/admin-register-request",
          },
          { name: "Otp Access", path: "/ztsPage/otp-login" },
        ],
      });
    }

   


    return tabs;
  }, [userRoleName, uniqueValues, flightDeals]);

  // Set the active tab based on the current location
  useEffect(() => {
    const currentPath = location.pathname + location.search;

    const matchedTab = mainTabs.find((tab) =>
      tab.subTabs.some((sub) => sub.path === currentPath)
    );

    setActiveTab(matchedTab ? matchedTab.name : "");

    if (matchedTab) {
      const matchedSub = matchedTab.subTabs.find(
        (sub) => sub.path === currentPath
      );

      setActiveSubTab(matchedSub ? matchedSub.name : "");
    } else {
      setActiveSubTab("");
    }
  }, [location.pathname, location.search, mainTabs]);

  const pendingBookingsHotel = hotelDeals.filter(
    (deal) => deal.status === "newBooking"
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
            <NavLink
              to="/"
              className="text-decoration-none text-dark fw-bold mb-4 d-block"
            >
              <p>Home</p>
            </NavLink>

            <ul className="list-unstyled">
              {mainTabs.map((tab) => (
                <li key={tab.name} className="mb-3">
                  <NavLink
                    to="/"
                    className={`text-decoration-none ${
                      activeTab === tab.name
                        ? "text-blue fw-bold"
                        : "text-dark "
                    }`}
                    onClick={() =>
                      setActiveTab(activeTab === tab.name ? "" : tab.name)
                    }
                  >
                    {tab.name}
                  </NavLink>

                  {activeTab === tab.name && (
                    <ul className="list-unstyled pl-3 mt-2">
                      {tab.subTabs.map((sub) => (
                        <li key={sub.name} className="mb-2">
                          <NavLink
                            to={sub.path}
                            className={`text-decoration-none ${
                              activeSubTab === sub.name
                                ? "text-success fw-bold"
                                : "text-dark fw-bold"
                            }`}
                            onClick={() => setActiveSubTab(sub.name)}
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
              className={`text-decoration-none d-flex align-items-center justify-content-between ${
                location.pathname === "/ztsPage/flight-deals"
                  ? "text-primary fw-bold"
                  : "text-dark "
              } mt-4`}
            >
              <span>Flight Booking</span>
              <span className="badge bg-danger ms-2">
                {pendingBookings > 0 ? pendingBookings : ""}
              </span>
            </NavLink>

            <NavLink
              to="/ztsPage/hotel-deals"
              className={`text-decoration-none d-flex align-items-center justify-content-between ${
                location.pathname === "/ztsPage/hotel-deals"
                  ? "text-primary fw-bold"
                  : "text-dark "
              } mt-4 d-block`}
            >
              <p>Hotel Booking</p>
              <span className="badge bg-danger ms-2">
                {pendingBookingsHotel > 0 ? pendingBookingsHotel : ""}
              </span>
            </NavLink>

            <NavLink
              to="/ztsPage/package"
              className="text-decoration-none text-dark mb-4 d-block"
            >
              <p>Packages</p>
            </NavLink>
            <NavLink
              to="/ztsPage/car"
              className="text-decoration-none text-dark mb-4 d-block"
            >
              <p>Cars</p>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
