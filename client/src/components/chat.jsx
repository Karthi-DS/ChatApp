// src/components/Chat.js
import { useEffect, useState, useRef } from "react";
import './chat.css'; // Make sure Chat.css is imported

// Ensure chat_background.jpg is in the public folder

const Chat = ({ socket, room, username }) => {
  const [currentmsg, setCurrentmsg] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef(null); // Ref for scrolling

  // --- Keep your existing sendMessage, useEffects, handleKeyPress functions ---
  const sendMessage = async () => {
    if (currentmsg.trim()) { // Check trimmed message
      const messageData = {
        room: room,
        author: username,
        message: currentmsg.trim(), // Send trimmed message
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      setChatHistory((prevHistory) => [...prevHistory, messageData]);
      setCurrentmsg("");
      try {
        await socket.emit("send_message", messageData);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      setChatHistory((prevHistory) => {
        const isDuplicate = prevHistory.some(
            msg => msg.author === data.author &&
                   msg.time === data.time &&
                   msg.message === data.message
        );
        if (data.author !== username && !isDuplicate) {
             return [...prevHistory, data];
         }
         return prevHistory;
      });
    };
    socket.on("receive_message", receiveMessageHandler);
    return () => {
      socket.off("receive_message", receiveMessageHandler);
    };
  }, [socket, username]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }
  // ---------------------------------------------------------------------------

  // Style for the outermost container div
  const pageBackgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/chat_background.jpg)`, // Use PUBLIC_URL
    backgroundSize: 'cover',        // Cover the entire div
    backgroundPosition: 'center',   // Center the image
    backgroundRepeat: 'no-repeat',  // Don't tile the image
    minHeight: '100vh',            // Ensure it takes at least full screen height
    width: '100%',                 // Ensure it takes full width
    display: 'flex',               // Use flexbox to center content
    alignItems: 'center',          // Center vertically (if content smaller than 100vh)
    justifyContent: 'center',      // Center horizontally
    padding: '1rem 0',             // Add some vertical padding (optional)
  };

   // Style for the chat card container itself to control its height within the page
   const chatCardStyle = {
     // Remove vh-100 from className as the parent controls height now
     // Set a max height or specific height if needed, less than 100vh
     // Example: make it take most of the screen but leave padding space
     height: 'calc(100vh - 4rem)', // Example: 100vh minus top/bottom padding (adjust as needed)
     maxHeight: '800px', // Optional: Set a max height for very large screens
     width: '100%' // Ensure it takes the width defined by chat-container class (max-width: 700px)
   }

  return (
    // Apply the background style to this outermost div
    <div style={pageBackgroundStyle}>
      {/* Remove <h1>hi</h1> unless you need it */}

      {/* The chat card component - Remove vh-100 from class, apply specific height style */}
      <div
        className="card d-flex flex-column chat-container" /* Removed vh-100 */
        style={chatCardStyle} // Apply height constraints
      >
        {/* Header */}
        <div className="card-header text-white text-center chat-header">
          <h5 className="mb-0">Room: {room} <span className="badge bg-light text-dark ms-2">User: {username}</span></h5>
        </div>

        {/* Chat Body - Needs its own background color/opacity from CSS for readability */}
        <div
          ref={chatBodyRef}
          className="chat-body"
          // Ensure Chat.css defines a background for chat-body, e.g.:
          // background-color: rgba(255, 255, 255, 0.9);
        >
          {chatHistory.map((item, index) => {
            const isUser = username === item.author;
            return (
              <div
                key={index}
                className={`message-bubble-container ${ isUser ? "justify-content-end" : "justify-content-start" }`}
              >
                <div
                  className={`message-bubble ${ isUser ? "user" : "other" }`}
                >
                  {!isUser && (
                      <div className="message-author">{item.author}</div>
                  )}
                  <p className="message-content">
                    {item.message}
                  </p>
                  <span className="message-time">
                    {item.time?.substring(0, 5) || item.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="card-footer chat-footer">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={currentmsg}
              onChange={(e) => setCurrentmsg(e.target.value)}
              onKeyDown={handleKeyPress}
              aria-label="Message Input"
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={sendMessage}
              disabled={!currentmsg.trim()}
            >
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </div> {/* End of chat-container card */}
    </div> // End of outer background div
  );
};

export default Chat;