import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./SearchUser.css";
import DefaultCover from "../Assets/DefaultCover.webp";

function SearchUser({ handleAccessChat }) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchUser = async (e) => {
    e.preventDefault();

    if (!search.trim()) {
      toast("Please enter something to search");
      return;
    }

    try {
      setLoading(true);

      const currUserId = sessionStorage.getItem("currUser");
      const token =
        localStorage.getItem(`token_${currUserId}`) || sessionStorage.getItem("token");
      const url = `${import.meta.env.VITE_API_URL}/user/search?username=${search}`;

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("search data-> ", data.users);
      setLoading(false);
      setSearchResult(data.users);
    } catch (error) {
      console.log(error.message);
      toast("Error occured! please try again");
    }
  };

  return (
    <div className="search-container">
      <form
        className="search-container-form"
        noValidate
        onSubmit={handleSearchUser}
      >
        <input
          className="search-input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for users"
        />
        <button className="search-button" type="submit">
          Go
        </button>
      </form>

      {searchResult.length === 0 ? (
        <div className="search-container-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path>
          </svg>
          <h2>Search users to chat with</h2>
        </div>
      ) : (
        <div className="search-result-container">
          {searchResult.map((user) => (
            <div className="search-result-item" key={user._id}>
              <div className="result-image">
                <img src={DefaultCover} alt="user cover photo" />
              </div>
              <div>
                <strong>{user.username}</strong>
              </div>
              <button
                onClick={() => handleAccessChat(user._id)}
                className="chat-button"
              >
                chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchUser;
