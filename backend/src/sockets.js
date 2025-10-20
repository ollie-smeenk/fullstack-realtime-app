import { Server } from "socket.io";
import axios from "axios";

export const startPolling = (io: Server) => {
  const POLL_MS = 5000;

  const poll = async () => {
    try {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        { params: { ids: "bitcoin,ethereum", vs_currencies: "usd" } }
      );
      const payload = { ts: Date.now(), prices: res.data };
      io.emit("market:update", payload);
    } catch (err) {
      console.error("poll err", err.message);
    }
  };

  setInterval(poll, POLL_MS);

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("chat:message", async (msg) => {
      if (msg.text.toLowerCase().includes("price")) {
        try {
          const res = await axios.get(
            "https://api.coingecko.com/api/v3/simple/price",
            { params: { ids: "bitcoin,ethereum", vs_currencies: "usd" } }
          );
          socket.emit("chat:message", {
            user: "Bot",
            text: `BTC: $${res.data.bitcoin.usd}, ETH: $${res.data.ethereum.usd}`,
          });
        } catch (err) {
          socket.emit("chat:message", { user: "Bot", text: "Error fetching prices." });
        }
      } else {
        io.emit("chat:message", msg);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
};

