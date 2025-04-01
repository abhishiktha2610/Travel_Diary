import React from "react";
import ProfileInfo from "./Cards/ProfileInfo";
import LOGO from "../assets/logo4.jpg";
import { useNavigate } from "react-router-dom";
import SearchBar from "./Input/SearchBar";

const Navbar = ({
  userInfo,
  searchQuery,
  setSearchQuery,
  onSearchStory,
  handleClearSearch,
}) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const handleSearch = () => {
    if (searchQuery) {
      onSearchStory(searchQuery);
    }
  };
  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
  };

  if (!userInfo) {
    return (
      <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
        <img src={LOGO} alt="travel diary" className="h-9" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <img src={LOGO} alt="travel diary" className="h-9" />
      {isToken && (
        <>
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />{" "}
        </>
      )}
    </div>
  );
};

export default Navbar;
