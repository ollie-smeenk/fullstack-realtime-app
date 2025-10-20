import { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";

interface Message {
  user: string;
  text: string;
}

const Chat = () => {
  const { socket } = useContext(UserContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!socket) return;

    socket.on("chat:message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("market:update", (data: any) => {
      setMessages((prev) => [
        ...prev,
        { user: "Market", text: `BTC: $${data.prices.bitcoin.usd}, ETH: $${data.prices.ethereum.usd}` },
      ]);
    });

    return () => {
      socket.off("chat:message");
      socket.off("market:update");
    };
  }, [socket]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    socket.emit("chat:message", { user: "You", text: input });
    setInput("");
  };

  return (
    <div>
      <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((m, i) => (
          <p key={i}><b>{m.user}:</b> {m.text}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;

