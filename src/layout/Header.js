import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Layout.css";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Get userToken from localStorage when the component mounts
    const tokenFromStorage = localStorage.getItem("userToken");
    setUserToken(tokenFromStorage);

    console.log("This is Token from Header: ", { tokenFromStorage });

    // Fetch user information if the user is logged in
    if (tokenFromStorage) {
      fetchUserInfo(tokenFromStorage);
    }
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  const fetchUserInfo = async (token) => {
    try {
      const response = await axios.get("https://api.realworld.io/api/user", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      // Assuming the API returns user information
      const userData = response.data.user;

      // Set user information in state
      setUserInfo(userData);
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          conduit
        </a>
        <ul className="nav navbar-nav flex-row ml-auto">
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/">
              Home
            </NavLink>
          </li>
          {userToken && userInfo ? (
            // Display this content when user is logged in
            <>
              <li className="nav-item" style={{ marginLeft: "1rem" }}>
                <NavLink className="nav-link" to="/editor">
                  <i
                    className="bi bi-pencil-square"
                    style={{ marginRight: "0.15rem" }}
                  ></i>
                  New Article
                </NavLink>
              </li>
              <li className="nav-item" style={{ marginLeft: "1rem" }}>
                <NavLink className="nav-link" to="/settings">
                  <i
                    className="bi bi-gear-wide"
                    style={{ marginRight: "0.15rem" }}
                  ></i>
                  Settings
                </NavLink>
              </li>
              <li
                className="nav-item"
                style={{
                  marginLeft: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Display user image and username */}
                <img
                  src={userInfo.image}
                  alt="UserImg"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    marginRight: "0.5rem",
                  }}
                />
                <a className="nav-link" href={`/${userInfo.username}`}>
                  {userInfo.username}
                </a>
              </li>
            </>
          ) : (
            // Display this content when user is not logged in
            <>
              <li className="nav-item" style={{ marginLeft: "1rem" }}>
                <NavLink className="nav-link" to="/login">
                  Sign in
                </NavLink>
              </li>
              <li className="nav-item" style={{ marginLeft: "1rem" }}>
                <NavLink className="nav-link" to="/register">
                  Sign up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
