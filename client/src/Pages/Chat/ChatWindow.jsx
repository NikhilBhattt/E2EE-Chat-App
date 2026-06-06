import { useMemo, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { replace, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import "./ChatWindow.css";
import timeSince from "../../Utils/timeSince";
import timeSinceUTC from "../../Utils/timeSince";
import DefaultCover from "../../Assets/DefaultCover.webp";
import SecurityPanel from "../../Components/SecurityPanel.jsx";
import SearchUser from "../../Components/SearchUser.jsx";

function ChatWindow() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currTab, setCurrTab] = useState("chat");
  const [msg, setMsg] = useState("");

  const [selectedChatId, setSelectedChatId] = useState(null);

  const activeChat = useMemo(
    () => chats.find((chat) => chat._id === selectedChatId) || chats[0],
    [selectedChatId],
  );

  async function handlLogout() {
    if (confirm("Are you sure you want to Logout?")) {
      // logout api
      try {
        const token = localStorage.getItem("token");
        const url = `${import.meta.env.VITE_API_URL}/user/logout`;

        const response = await axios.post(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        localStorage.clear();
        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Logout error: ", error);
      }
    }
  }

  const socket = useMemo(() => io(import.meta.env.VITE_SERVER_URL), []);

  function handleMessageSend() {
    setMsg("");

    socket.emit("message-send", {});
  }

  async function accessChat(userId) {
    // create chat with this userId

    try {
      const url = `${import.meta.env.VITE_API_URL}/chat/`;
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        url,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("access chat data ", data);

      setCurrTab("chat");
      setSelectedChatId(data.chat._id);

      if (!chats.find((ch) => ch._id === data.chat._id)) {
        setChats((prev) => [...prev, data.chat]);
      }
    } catch (error) {
      toast("Try again please!");
    }
  }

  useEffect(() => {
    // toast("Welcome to CipherChat!");

    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("message", (m) => {
      console.log(m);
    });

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_API_URL}/user/me`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
    };
    fetchUser();

    const fetchChats = async () => {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_API_URL}/chat/`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.chats) {
        setSelectedChatId(response.data.chats?.[0]?._id);
        setChats(response.data.chats);
      }
    };
    fetchChats();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <main className="dashboard">
        <aside className="sidebar">
          <div className="panel-inner">
            <div className="sidebar-top">
              <div className="brand-chip">
                <span className="brand-dot"></span>
                <span>CipherChat</span>
              </div>

              <div className="user-card">
                <div className="user-avatar">
                  <img src={DefaultCover} alt="User avatar" />
                </div>
                <div className="user-meta">
                  <strong>{user?.username}</strong>
                  <span>Online · Secure</span>
                </div>

                <div className="user-logout">
                  <button className="logout-btn" onClick={handlLogout}>
                    <i className="ri-logout-box-r-line"></i>
                  </button>
                </div>
              </div>

              <nav className="nav-menu">
                <div
                  className={`nav-item ${currTab == "search" ? " active" : ""}`}
                  onClick={() => setCurrTab("search")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path>
                  </svg>
                  <span>Search </span>
                </div>
                <div
                  className={`nav-item ${currTab == "chat" ? " active" : ""}`}
                  onClick={() => setCurrTab("chat")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM5.76282 17H20V5H4V18.3851L5.76282 17ZM11 10H13V12H11V10ZM7 10H9V12H7V10ZM15 10H17V12H15V10Z"></path>
                  </svg>
                  <span>Chats</span>
                </div>
              </nav>
            </div>

            {currTab == "chat" ? (
              <div className="conversation-list">
                {chats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`conversation-card ${chat._id === selectedChatId ? "active" : ""}`}
                    onClick={() => setSelectedChatId(chat._id)}
                  >
                    <div className="conversation-avatar">
                      <img
                        src={DefaultCover}
                        alt={`${chat.users.map((ch) => {
                          if (ch._id !== user.id) return ch.username;
                        })} avatar`}
                      />
                      <span
                        className={chat.online ? "status-dot online" : ""}
                      ></span>
                    </div>
                    <div className="conversation-content">
                      <strong>
                        {chat.users.map((ch) => {
                          if (ch._id !== user.id) return ch.username;
                        })}
                      </strong>
                      <span>
                        {chat.latestMessage ?? "Tap to start Conversation."}
                      </span>
                    </div>
                    <div className="conversation-meta">
                      <small>{timeSinceUTC(chat.updatedAt)}</small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <SearchUser handleAccessChat={accessChat} />
            )}
          </div>
        </aside>

        <section className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-header-avatar">
                <img src={DefaultCover} alt={`Cover avatar`} />
              </div>
              <div className="chat-header-meta">
                <strong>
                  {activeChat?.users.map((ch) => {
                    if (ch._id !== user.id) return ch.username;
                  })}
                </strong>
                {/* <span>{chats.online ? "Active now" : "Last seen 20m ago"}</span> */}
              </div>
            </div>
            <div className="chat-actions">
              <button type="button" aria-label="More options">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>

          <div className="encryption-banner">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3L5 6V11C5 15.418 8.91 19.44 13.5 20.35C18.09 19.44 22 15.418 22 11V6L15 3H12Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11V14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M12 17H12.01"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span>Messages are end-to-end encrypted</span>
          </div>

          <div className="message-thread">
            {messages.map((message) => (
              <div key={message.id} className="message-group">
                <div className={`message-bubble ${message.type}`}>
                  <p className="message-text">{message.text}</p>
                  <div className="message-info">
                    <span>{message.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="message-input">
            <form className="input-row" onSubmit={handleMessageSend}>
              <input
                type="text"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type a secure message..."
                aria-label="Type a secure message"
              />
              <button className="send-button" type="submit">
                <i className="ri-send-plane-2-line"></i>
              </button>
            </form>
          </div>
        </section>
        <SecurityPanel />
      </main>
      <ToastContainer />
    </>
  );
}

export default ChatWindow;
