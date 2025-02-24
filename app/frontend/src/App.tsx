import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import dotenv from "dotenv";

dotenv.config();
const URL = process.env.URL ?? "localhost"
function App() {
  const [message, setMessage] = useState<string | null>(null);
  const [apiData, setApiData] = useState<any>(null); // State to hold the API data
  const [isLoading, setIsLoading] = useState<boolean>(true); // State to track loading

  useEffect(() => {
    // Connect to WebSocket server
    const socket = new WebSocket(`ws://${URL}:3000/ws`);
    
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

  // Fetch data from the REST API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch(`http://${URL}:3000/analytics/weekday/Deposit`);
        setApiData(response)
        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json(); // Parse the JSON data
        setApiData(data); // Store the received data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <code>{message || "No messages yet"}</code>
        {/* Display the loading state or the API data */}
        <div>
          <h2>API Data:</h2>
          {isLoading ? (
            <p>Loading data...</p> // Show loading message
          ) : apiData ? (
            <pre>{JSON.stringify(apiData, null, 2)}</pre>
          ) : (
            <p>No data available.</p> // Show message if no data
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
