import { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";

function App() {
  

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
