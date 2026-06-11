import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "./SearchUser.css";
import DefaultCover from "../Assets/DefaultCover.webp";
import EmptyChatContainer from "./EmptyChatContainer";

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
        localStorage.getItem(`token_${currUserId}`) ||
        sessionStorage.getItem("token");
      const url = `${import.meta.env.VITE_API_URL}/user/search?username=${search}`;

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      setSearchResult(data.users);
    } catch (error) {
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
        <EmptyChatContainer />
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
