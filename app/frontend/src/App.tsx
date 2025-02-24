import React,{useEffect,useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    // Connect to WebSocket server
    const socket = new WebSocket("ws://localhost:3000/ws");
    console.log(socket)
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      console.log("Received update:", event.data);
      setMessage(event.data); // Update state with the received message
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup WebSocket on component unmount
    return () => {
      socket.close();
    };
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <code>{message || "No messages yet"}</code>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
