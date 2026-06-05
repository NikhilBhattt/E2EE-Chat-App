import { useMemo, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { replace, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import "./ChatWindow.css";
import timeSince from "../../Utils/timeSince";
import timeSinceUTC from "../../Utils/timeSince";
import DefaultCover from "../../Assets/DefaultCover.webp";

function ChatWindow() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  ``;
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
        setSelectedChatId(response.data.chats?.[0]._id)
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
                <div className="nav-item active">
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

        <aside className="security-panel">
          <div className="panel-inner">
            <h3> Security Dashboard</h3>
            <div className="security-card">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3L5 6V11C5 15.418 8.91 19.44 13.5 20.35C18.09 19.44 22 15.418 22 11V6L15 3H12Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M12 11V14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M12 17H12.01"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                ></path>
              </svg>
              <strong>Encryption Enabled</strong>
            </div>
            <div className="security-card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 14V16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM21.4462 20.032L22.9497 21.5355L21.5355 22.9497L20.032 21.4462C19.4365 21.7981 18.7418 22 18 22C15.7909 22 14 20.2091 14 18C14 15.7909 15.7909 14 18 14C20.2091 14 22 15.7909 22 18C22 18.7418 21.7981 19.4365 21.4462 20.032ZM18 20C19.1046 20 20 19.1046 20 18C20 16.8954 19.1046 16 18 16C16.8954 16 16 16.8954 16 18C16 19.1046 16.8954 20 18 20Z"></path>
              </svg>
              <strong>Verified User</strong>
            </div>
            <div className="security-card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M0.689453 6.99659C3.78027 4.49704 7.71526 3 11.9999 3C16.2845 3 20.2195 4.49704 23.3104 6.99659L22.0536 8.55252C19.3062 6.3307 15.8085 5 11.9999 5C8.19133 5 4.69356 6.3307 1.94617 8.55252L0.689453 6.99659ZM3.83124 10.8864C6.0635 9.08119 8.90544 8 11.9999 8C15.0944 8 17.9363 9.08119 20.1686 10.8864L18.9118 12.4424C17.023 10.9149 14.6183 10 11.9999 10C9.38151 10 6.97679 10.9149 5.08796 12.4424L3.83124 10.8864ZM6.97304 14.7763C8.34673 13.6653 10.0956 13 11.9999 13C13.9042 13 15.6531 13.6653 17.0268 14.7763L15.7701 16.3322C14.7398 15.499 13.4281 15 11.9999 15C10.5717 15 9.26002 15.499 8.22975 16.3322L6.97304 14.7763ZM10.1148 18.6661C10.63 18.2495 11.2858 18 11.9999 18C12.714 18 13.3698 18.2495 13.885 18.6661L11.9999 21L10.1148 18.6661Z"></path>
              </svg>
              <strong>Secure Connection</strong>
            </div>
            <div className="security-card security-pill">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2L4 5V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V5L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.5 12.5L11.5 14.5L15 11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Connection verified
            </div>
            <p className="security-note">
              Hover over a conversation to preview unread messages and monitor
              active session health across your secure channels.
            </p>
          </div>
        </aside>
      </main>
      <ToastContainer />
    </>
  );
}

export default ChatWindow;
