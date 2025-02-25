import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import type { ApiResponse } from "./types";
const URL = "localhost";
function App() {
	const [message, setMessage] = useState<string | null>(null);
	const [apiData, setApiData] = useState<ApiResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const socket = new WebSocket(`ws://${URL}:3000/ws`);

		socket.onopen = () => {
			console.log("Connected to WebSocket server");
		};

		socket.onmessage = (event) => {
			console.log("Received update:", event.data);
			setMessage(event.data);
		};

		socket.onclose = () => {
			console.log("WebSocket disconnected");
		};

		socket.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		return () => {
			socket.close();
		};
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response = await fetch(
					`http://${URL}:3000/analytics/weekday/Deposit`,
				);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();
				setApiData(data);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<code>{message || "No messages yet"}</code>
				<div>
					<h2>API Data:</h2>
					{isLoading ? (
						<p>Loading data...</p>
					) : apiData ? (
						<pre>{JSON.stringify(apiData, null, 2)}</pre>
					) : (
						<p>No data available.</p>
					)}
				</div>
			</header>
		</div>
	);
}

export default App;
