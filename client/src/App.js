// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import io from 'socket.io-client';
import JoinChat from './components/JoinChat';
import Chat from './components/chat';
import AboutPage from './components/AboutPage'; // Import the new About page

// IMPORTANT: Replace with your actual server URL
const SOCKET_SERVER_URL = "http://localhost:3001"; // Or whatever your server runs on

function App() {
  const [socket, setSocket] = useState(null);
  const [isJoined, setIsJoined] = useState(false); // Use a boolean state for joining status
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  // Effect to initialize and disconnect socket
  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SOCKET_SERVER_URL);
    console.log("Socket connecting...");
    setSocket(newSocket);

    newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        // Optionally reset state if needed on disconnect
        // setIsJoined(false);
        // setUsername("");
        // setRoom("");
    });

    newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        // Handle connection error (e.g., show message to user)
    });


    // Cleanup: Disconnect socket when App component unmounts
    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once

  // Function called by JoinChat component
  const handleJoin = (joinedUsername, joinedRoom) => {
    console.log("App: handleJoin called with:", joinedUsername, joinedRoom); // <-- Log 6
    if (socket && joinedUsername && joinedRoom) {
      console.log("App: Socket exists and credentials provided."); // <-- Log 7
      setUsername(joinedUsername);
      setRoom(joinedRoom);
      console.log(`App: Emitting 'join_room' for room: ${joinedRoom}`); // <-- Log 8
      socket.emit("join_room", joinedRoom, (ack) => {
          // This callback runs IF the server calls the acknowledgment function
          console.log("App: Server Acknowledged join_room:", ack); // <-- Log 9
          console.log("App: Setting isJoined to true. (Inside Callback)"); // <-- Log 10 (modified)
          // setIsJoined(true); // <<<<<<<< COMMENT OUT THE LINE INSIDE THE CALLBACK
      });

      // Temporarily add this OUTSIDE the callback to see if emit is the issue
      // This will force the redirect regardless of server acknowledgement.
      console.log("App: Setting isJoined immediately after emit (TEMPORARY TEST)"); // <<<<<<<< ADD THIS LOG
      setIsJoined(true); // <<<<<<<< UNCOMMENT OR ADD THIS LINE *OUTSIDE* THE CALLBACK

    } else {
      console.error("App: handleJoin failed. Socket available?", !!socket, "Username?", joinedUsername, "Room?", joinedRoom); // <-- Log 11
    }
  };

  return (
    <Router> {/* Wrap everything in the Router */}
      <div className="App">
        <Routes> {/* Define the routes */}
          {/* Route for the About Page (default route) */}
          <Route path="/" element={<AboutPage />} />

          {/* Route for the Join Page */}
          <Route
            path="/join"
            element={
              !isJoined ? (
                <JoinChat onJoin={handleJoin} />
              ) : (
                // If already joined, redirect to the chat page
                <Navigate to="/chat" replace />
              )
            }
          />

          {/* Route for the Chat Page */}
          <Route
            path="/chat"
            element={
              isJoined && socket ? (
                <Chat socket={socket} username={username} room={room} />
              ) : (
                // If not joined or socket not ready, redirect to the join page
                <Navigate to="/join" replace />
              )
            }
          />

          {/* Optional: Catch-all route for unknown paths */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;