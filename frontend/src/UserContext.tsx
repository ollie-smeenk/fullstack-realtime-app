import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

interface User {
  name: string;
  email: string;
  picture: string;
}

interface UserContextType {
  user: User | null;
  logout: () => void;
  socket: Socket | null;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  logout: () => {},
  socket: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // ✅ Use environment variable for backend API URL
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/user`, { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));

    const s = io(API_URL, { withCredentials: true });
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [API_URL]);

  const logout = () => {
    axios
      .post(`${API_URL}/auth/logout`, {}, { withCredentials: true })
      .then(() => setUser(null));
  };

  return (
    <UserContext.Provider value={{ user, logout, socket }}>
      {children}
    </UserContext.Provider>
  );
};
