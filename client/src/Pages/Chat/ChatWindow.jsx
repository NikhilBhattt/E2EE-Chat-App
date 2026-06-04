import { useMemo, useState, useEffect } from "react";
import "./ChatWindow.css";
import { io } from "socket.io-client";

const chats = [
  {
    id: 1,
    name: "Arianna Wells",
    message: "See you at the secure group later.",
    time: "11:42 AM",
    unread: 2,
    online: true,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 2,
    name: "Ethan Park",
    message: "Everything is encrypted end to end.",
    time: "9:18 AM",
    unread: 0,
    online: false,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 3,
    name: "CipherOps",
    message: "New security logs are ready for review.",
    time: "Yesterday",
    unread: 5,
    online: true,
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 4,
    name: "Nova Team",
    message: "Double-check your key backup before tonight.",
    time: "Mon",
    unread: 0,
    online: false,
    avatar:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=120&q=80",
  },
];

const messages = [
  {
    id: 1,
    type: "incoming",
    text: "Hey, are you online for the encrypted sync?",
    time: "11:36 AM",
  },
  {
    id: 2,
    type: "outgoing",
    text: "Yes, I’m here. The channel is private and keys are active.",
    time: "11:37 AM",
  },
  {
    id: 3,
    type: "incoming",
    text: "Perfect. I just confirmed the fingerprint on both devices.",
    time: "11:38 AM",
  },
  {
    id: 4,
    type: "outgoing",
    text: "Great. I’ll send the auth token in the next message.",
    time: "11:39 AM",
  },
  {
    id: 5,
    type: "Incoming",
    text: "lorem ipsum is great for me.",
    time: "11:39 AM",
  },
  {
    id: 6,
    type: "Incoming",
    text: "Great. I’ll send the auth token in the next message.",
    time: "11:39 AM",
  },
  {
    id: 7,
    type: "outgoing",
    text: "Great. I’ll send the auth token in the next message.",
    time: "11:39 AM",
  },
];

function ChatWindow() {
  const [selectedChatId, setSelectedChatId] = useState(chats[0].id);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId) || chats[0],
    [selectedChatId],
  );

  const socket = useMemo(() => io("http://localhost:3000"), []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("welcome", (m) => {
      console.log(m);
    });

    socket.on("message", (m) => {
      console.log(m);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
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
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                  alt="User avatar"
                />
              </div>
              <div className="user-meta">
                <strong>Nova Giles</strong>
                <span>Online · Secure</span>
              </div>
            </div>

            <nav className="nav-menu">
              <div className="nav-item active">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 19.5V6.5C4 5.67 4.67 5 5.5 5H18.5C19.33 5 20 5.67 20 6.5V19.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 4.5V7.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 4.5V7.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9 11.5H15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9 15.5H13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Chats</span>
              </div>
              <div className="nav-item">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 15.5C14.4853 15.5 16.5 13.4853 16.5 11C16.5 8.51472 14.4853 6.5 12 6.5C9.51472 6.5 7.5 8.51472 7.5 11C7.5 13.4853 9.51472 15.5 12 15.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M4.1499 11C4.1099 9.35 4.6899 7.77 5.7599 6.51L6.4399 7.22C7.5599 8.36 8.0399 9.83 8.0399 11.35C8.0399 12.87 7.5599 14.34 6.4399 15.48L5.7599 16.19C4.6899 14.93 4.1099 13.35 4.1499 11Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M19.85 11C19.89 12.65 19.31 14.23 18.24 15.49L17.56 14.78C16.44 13.64 15.96 12.17 15.96 10.65C15.96 9.13 16.44 7.66 17.56 6.52L18.24 5.81C19.31 7.07 19.89 8.65 19.85 10.29Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
                <span>Settings</span>
              </div>
            </nav>
          </div>

          <div className="conversation-list">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`conversation-card ${chat.id === selectedChatId ? "active" : ""}`}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <div className="conversation-avatar">
                  <img src={chat.avatar} alt={`${chat.name} avatar`} />
                  <span
                    className={chat.online ? "status-dot online" : ""}
                  ></span>
                </div>
                <div className="conversation-content">
                  <strong>{chat.name}</strong>
                  <span>{chat.message}</span>
                </div>
                <div className="conversation-meta">
                  <small>{chat.time}</small>
                  {chat.unread > 0 && (
                    <span className="unread-badge">{chat.unread}</span>
                  )}
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
              <img src={activeChat.avatar} alt={`${activeChat.name} avatar`} />
            </div>
            <div className="chat-header-meta">
              <strong>{activeChat.name}</strong>
              <span>
                {activeChat.online ? "Active now" : "Last seen 20m ago"}
              </span>
            </div>
          </div>
          <div className="chat-actions">
            <button type="button" aria-label="Search chat">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle
                  cx="10.5"
                  cy="10.5"
                  r="6.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M16.75 16.75L21 21"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
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
          <div className="input-row">
            <input
              type="text"
              placeholder="Type a secure message..."
              aria-label="Type a secure message"
            />
            <button className="send-button" type="button">
              <i className="ri-send-plane-2-line"></i>
            </button>
          </div>
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
  );
}

export default ChatWindow;
