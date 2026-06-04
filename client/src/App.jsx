import { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";

function App() {
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

  const [msg, setMsg] = useState("");

  function handleSendMessage(e) {
    e.preventDefault();

    if (!msg) return;

    socket.emit("message", msg);
    setMsg("");
  } 

  return (
    <div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          onChange={e => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
