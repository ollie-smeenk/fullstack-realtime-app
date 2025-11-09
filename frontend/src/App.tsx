import { useContext } from "react";
import { UserContext } from "./UserContext";

function App() {
  const { user, logout, socket } = useContext(UserContext);

  // ✅ Use environment variable for backend API URL
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000";

  return (
    <div className="App">
      <h1>Fullstack Realtime App</h1>

      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <img src={user.picture} alt="avatar" width={50} />
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <a href={`${API_URL}/auth/google`}>
          <button>Login with Google</button>
        </a>
      )}

      {socket && <p>Socket connected: {socket.connected.toString()}</p>}
    </div>
  );
}

export default App;
