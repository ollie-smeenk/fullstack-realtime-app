import { useContext } from "react";
import { UserContext } from "./UserContext";
import Chat from "./Chat";

function App() {
  const { user, logout, socket } = useContext(UserContext);

  return (
    <div className="App">
      <h1>Fullstack Realtime App</h1>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <img src={user.picture} alt="avatar" width={50} />
          <button onClick={logout}>Logout</button>
          <Chat />
        </div>
      ) : (
        <a href="http://localhost:4000/auth/google">
          <button>Login with Google</button>
        </a>
      )}

      {socket && <p>Socket connected: {socket.connected.toString()}</p>}
    </div>
  );
}

export default App;

