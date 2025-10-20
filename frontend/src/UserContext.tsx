import { createContext, useState, ReactNode, useEffect } from "react";
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

  useEffect(() => {
    axios.get("http://localhost:4000/auth/user", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));

    const s = io("http://localhost:4000");
    setSocket(s);

    return () => { s.disconnect(); };
  }, []);

  const logout = () => {
    axios.post("http://localhost:4000/auth/logout", {}, { withCredentials: true })
      .then(() => setUser(null));
  };

  return (
    <UserContext.Provider value={{ user, logout, socket }}>
      {children}
    </UserContext.Provider>
  );
};

