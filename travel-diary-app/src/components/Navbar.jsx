import React from "react";
import ProfileInfo from "./Cards/ProfileInfo";
import LOGO from "../assets/logo4.jpg";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userInfo }) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const Navbar = ({ userInfo }) => {
    const isToken = localStorage.getItem("token");
    const navigate = useNavigate();

    const onLogout = () => {
      localStorage.clear();
      navigate("/login");
    };

    if (!userInfo) {
      return (
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
          <img src={LOGO} alt="travel diary" className="h-9" />
          <p>Loading...</p> {/* Show loading state while fetching user info */}
        </div>
      );
    }

    return (
      <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
        <img src={LOGO} alt="travel diary" className="h-9" />
        {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
      </div>
    );
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <img src={LOGO} alt="travel diary" className="h-9" />
      {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
  );
};

export default Navbar;
