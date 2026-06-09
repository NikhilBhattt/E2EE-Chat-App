import { useMemo, useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { replace, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import "./ChatWindow.css";
import timeSince from "../../Utils/timeSince";
import timeSinceIST from "../../Utils/timeSince";
import DefaultCover from "../../Assets/DefaultCover.webp";
import SecurityPanel from "../../Components/SecurityPanel.jsx";
import SearchUser from "../../Components/SearchUser.jsx";

import {
  getStoredPrivateKey,
  importPrivateKey,
} from "../../crypto/keyStorage.js";
import { importPublicKey } from "../../crypto/keyStorage.js";
import { deriveSharedKey } from "../../crypto/deriveSharedKey.js";
import { encryptMessage } from "../../crypto/encryptMessage.js";
import { decryptMessage } from "../../crypto/decryptMessage.js";

function ChatWindow() {
  const navigate = useNavigate();

  const socket = useMemo(() => io(import.meta.env.VITE_SERVER_URL), []);
  const [socketConnected, setSocketConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [decryptedMessages, setDecryptedMessages] = useState({});
  const [currTab, setCurrTab] = useState("chat");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [msg, setMsg] = useState("");

  const [selectedChatId, setSelectedChatId] = useState(null);
  const messageThreadRef = useRef(null);

  const getCurrentToken = () => {
    const currUserId = sessionStorage.getItem("currUser");
    return (
      localStorage.getItem(`token_${currUserId}`) ||
      sessionStorage.getItem("token")
    );
  };

  const activeChat = useMemo(
    () => chats.find((chat) => chat._id === selectedChatId),
    [selectedChatId],
  );

  // filter message for current Chat and Connect to Socket
  const filteredMessages = useMemo(() => {
    if (!activeChat) return [];

    socket.emit("join-chat", activeChat._id);

    return messages.filter((msg) => {
      const case1 =
        activeChat.users.find((u) => u._id === msg.reciever) !== undefined;

      const case2 =
        activeChat.users.find((u) => u._id === msg.sender) !== undefined;

      return case1 && case2;
    });
  }, [activeChat, messages]);

  async function handleLogout() {
    if (confirm("Are you sure you want to Logout?")) {
      try {
        const token = getCurrentToken();
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
        const currUserId = sessionStorage.getItem("currUser");
        localStorage.removeItem(`token_${currUserId}`);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("currUser");

        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Logout error: ", error);
      }
    }
  }

  function updateChatLatestMessage(chatId, message) {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === chatId ? { ...chat, latestMessage: message } : chat,
      ),
    );
  }

  async function handleMessageSend(e) {
    e.preventDefault();
    if (!msg.trim()) return;

    try {
      socket.emit("stop-typing", activeChat)
      setIsTyping(false)
      const token = getCurrentToken();
      const url = `${import.meta.env.VITE_API_URL}/message/`;

      const reciever = activeChat.users.find((u) => u._id !== user.id);

      const recieverPublicKey = await importPublicKey(reciever.publicKey);

      const senderPrivateKey = await importPrivateKey(
        getStoredPrivateKey(user.id),
      );

      const aesKey = await deriveSharedKey(senderPrivateKey, recieverPublicKey);
      const encrypted = await encryptMessage(msg.trim(), aesKey);

      const bodyData = {
        cipherText: encrypted.cipherText,
        iv: encrypted.iv,
        recieverId: reciever._id,
      };

      const { data } = await axios.post(url, bodyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.message) {
        socket.emit("new-message", {
          chat: activeChat,
          newMessage: data.message,
        });
        updateChatLatestMessage(activeChat._id, data.message);
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (error) {
      toast("Error Occured! try again please.");
    } finally {
      setMsg("");
    }
  }

  async function accessChat(userId) {
    try {
      const url = `${import.meta.env.VITE_API_URL}/chat/`;
      const token = getCurrentToken();

      const { data } = await axios.post(
        url,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCurrTab("chat");
      setSelectedChatId(data.chat._id);

      if (!chats.find((ch) => ch._id === data.chat._id)) {
        setChats((prev) => [...prev, data.chat]);
      }
    } catch (error) {
      toast("Try again please!");
    }
  }

  function typingHandler(e) {
    setMsg(e.target.value);

    if (!socketConnected) return;

    if (!typing){
      setTyping(true);
      socket.emit("start-typing", activeChat);
    } 

    let lastTypingTime = new Date().getTime();
    let  timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDifference = timeNow - lastTypingTime;

      if (timeDifference >= timerLength && typing) {
        socket.emit("stop-typing", activeChat);
        setTyping(false);
      }
    }, timerLength);
  }

  useEffect(() => {
    // toast("Welcome to CipherChat!");

    const fetchUser = async () => {
      const token = getCurrentToken();
      const url = `${import.meta.env.VITE_API_URL}/user/me`;

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data.user);
    };

    const fetchChats = async () => {
      const token = getCurrentToken();
      const url = `${import.meta.env.VITE_API_URL}/chat/`;

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.chats) {
        setChats(data.chats);
      }
    };

    const fetchMessages = async () => {
      const token = getCurrentToken();
      const url = `${import.meta.env.VITE_API_URL}/message/all`;

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.messages) {
        setMessages(data.messages);
      }
    };

    fetchUser();
    fetchChats();
    fetchMessages();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const decryptAll = async () => {
      for (const message of messages) {
        const key = message._id || message.createdAt;
        if (decryptedMessages[key]) continue;

        try {
          const otherUserId =
            message.sender === user.id ? message.reciever : message.sender;
          const url = `${import.meta.env.VITE_API_URL}/user/${otherUserId}/public-key`;
          const token = getCurrentToken();
          const { data } = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const otherUserPublicKey = await importPublicKey(data.publicKey);
          const myPrivateKey = await importPrivateKey(
            getStoredPrivateKey(user.id),
          );

          const aesKey = await deriveSharedKey(
            myPrivateKey,
            otherUserPublicKey,
          );

          const plain = await decryptMessage(
            message.cipherText,
            message.iv,
            aesKey,
          );

          setDecryptedMessages((prev) => ({ ...prev, [key]: plain }));
        } catch (err) {
          console.error(err);
          setDecryptedMessages((prev) => ({
            ...prev,
            [key]: "(decryption failed)",
          }));
        }
      }
    };

    decryptAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, user]);

  useEffect(() => {
    if (!messageThreadRef.current) return;
    const thread = messageThreadRef.current;
    thread.scrollTop = thread.scrollHeight;
  }, [filteredMessages, isTyping]);

  useEffect(() => {
    const handler = ({ chat, newMessage }) => {
      updateChatLatestMessage(chat._id, newMessage);
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("message-recieve", handler);
    return () => {
      socket.off("message-recieve", handler);
    };
  }, [socket, activeChat]);

  useEffect(() => {
    socket.on("connected", () => setSocketConnected(true));

    socket.on("start-typing", () => {
      setIsTyping(true);
    });

    socket.on("stop-typing", () => {
      setIsTyping(false);
    });
  }, []);

  return (
    <>
      <main className={`dashboard ${selectedChatId ? "chat-active" : ""}`}>
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
                  <button className="logout-btn" onClick={handleLogout}>
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
                    </div>
                    <div className="conversation-content">
                      <strong>
                        {chat.users.map((ch) => {
                          if (ch._id !== user.id) return ch.username;
                        })}
                      </strong>
                      <span>
                        {chat.latestMessage?._id
                          ? `${
                              chat.latestMessage.sender === user.id
                                ? "You: "
                                : ""
                            }${decryptedMessages[chat.latestMessage._id] || "Loading..."}`
                          : "Tap to start chat"}
                      </span>
                    </div>
                    <div className="conversation-meta">
                      <small>{timeSinceIST(chat.updatedAt)}</small>
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
          {selectedChatId ? (
            <>
              <div className="chat-header">
                <button
                  className="back-button-mobile"
                  onClick={() => setSelectedChatId(null)}
                  aria-label="Go back to chat list"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 12.0001L11.7782 4.22217L13.1924 5.63639L7.82843 10.9999Z"></path>
                  </svg>
                </button>
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
                    <span>
                      {chats.online ? "Active now" : "Last seen 20m ago"}
                    </span>
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

              <div className="message-thread" ref={messageThreadRef}>
                {filteredMessages.map((message, idx) => (
                  <div key={idx} className="message-group">
                    <div
                      className={`message-bubble ${
                        message.sender === user.id ? "outgoing" : "incoming"
                      }`}
                    >
                      <p className="message-text">
                        {decryptedMessages[message._id || message.createdAt] ??
                          "Decrypting..."}
                      </p>
                      <div className="message-info">
                        <span>{timeSince(message.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="typing-indicator">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    {/* <span className="typing-text">typing...</span> */}
                  </div>
                )}
              </div>

              <div className="message-input">
                <form className="input-row" onSubmit={handleMessageSend}>
                  <input
                    type="text"
                    value={msg}
                    onChange={typingHandler}
                    placeholder="Type a secure message..."
                    aria-label="Type a secure message"
                  />
                  <button className="send-button" type="submit">
                    <i className="ri-send-plane-2-line"></i>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="empty-chat-state">
              <div className="empty-chat-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="empty-chat-icon"
                >
                  <path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM5.76282 17H20V5H4V18.3851L5.76282 17ZM11 10H13V12H11V10ZM7 10H9V12H7V10ZM15 10H17V12H15V10Z"></path>
                </svg>
                <h2>Select a conversation to start chatting</h2>
                <p>
                  Choose a chat from the list or search for a user to begin your
                  encrypted conversation.
                </p>
              </div>
            </div>
          )}
        </section>
        <SecurityPanel />
      </main>
      <ToastContainer />
    </>
  );
}

export default ChatWindow;
