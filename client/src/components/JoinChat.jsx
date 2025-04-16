// src/components/JoinChat.js
import React, { useState } from "react";

const JoinChat = ({ onJoin }) => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const handleJoinClick = () => {
    console.log("JoinChat: handleJoinClick triggered."); // <-- Log 1
    console.log("JoinChat: Current username:", username); // <-- Log 2
    console.log("JoinChat: Current room:", room);       // <-- Log 3
    if (username.trim() && room.trim()) {
      console.log("JoinChat: Validation passed. Calling onJoin..."); // <-- Log 4
      onJoin(username, room); // Pass username and room up to the parent
    } else {
      console.log("JoinChat: Validation failed."); // <-- Log 5
      alert("Please enter both a username and a room ID."); // Simple validation
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        handleJoinClick();
    }
  }

  return (
    // ... rest of the JoinChat component JSX ...
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h3 className="card-title text-center mb-4 text-primary">Join a Chat Room</h3>
        <div className="mb-3">
          <label htmlFor="usernameInput" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="usernameInput"
            placeholder="Enter your username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="roomInput" className="form-label">Room ID</label>
          <input
            type="text"
            className="form-control"
            id="roomInput"
            placeholder="Enter room ID..."
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary w-100"
          onClick={handleJoinClick} // Make sure this onClick is here
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default JoinChat;