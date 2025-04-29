import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/Auth";
import { IoIosContact } from "react-icons/io";
import { toggleTheme } from "../redux/theme/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaMoon, FaSun } from "react-icons/fa";

const Header = () => {
  const { auth, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);


  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (

    <div className="mt-1">
      {!isAuthenticated ? (
        <>
          <div className="dropdown-user">
            <NavLink to="/login" >
              Login
            </NavLink>

          </div>
        </>

      ) : (
        <>

          {/* <div className="d-flex">
            <button onClick={() => dispatch(toggleTheme())}>
              {theme === "light" ? <FaSun /> : <FaMoon />}
            </button>
          </div> */}

          <div className="dropdown-user">
            <NavLink
              className="nav-link dropdown-toggle icon float-right"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              style={{ border: "none" }}
            >
              {auth?.user?.userName}
            </NavLink>
            <ul className="dropdown-menu">
              <li>
                <NavLink
                  to={`/dashboard/${auth?.user?.role}`}
                  className="dropdown-item"
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={handleLogout}
                  to="#"
                  className="dropdown-item"
                >
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
        </>
      )}

    </div>

  );
};

export default Header;
