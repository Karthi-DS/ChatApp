import { useEffect, useState } from "react";

const Chat = ({ socket, room, username }) => {
  const [currentmsg, setCurrentmsg] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    console.log(currentmsg);
    if (currentmsg) {
      const messageData = {
        room: room,
        author: username,
        message: currentmsg,
        time: new Date().getHours() + ":" + new Date().getMinutes(),
      };
      setChatHistory([...chatHistory, messageData]);
      setCurrentmsg("");
      await socket.emit("send_message", messageData);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChatHistory([...chatHistory, data]);
    });
  }, [socket, chatHistory]);
  return (
    <div className="w-[250px] h-[400px] border-gray-200 border-2 bg-slate-200 flex flex-col">
      <div className="flex justify-center p-2 bg-white border-1 border-gray-100 font-bold text-blue-700">
        <h2>Room: {room}</h2>
      </div>
      <div className="relative w-full h-full overflow-y-auto p-4 flex flex-col gap-2">
        {chatHistory.map((item, index) => (
          <div
            key={index}
            className={`max-w-[70%] relative pr-10 p-2 rounded-lg text-white font-medium ${
              username === item.author
                ? "bg-green-400 self-end" // Messages from user align to the right
                : "bg-blue-300 self-start" // Messages from others align to the left
            }`}
          >
            <p>{item.message}</p>
            <span className="absolute text-xs bottom-0 right-0 p-1 text-gray-600 mt-1 text-right">
              {item.time}
            </span>
          </div>
        ))}
      </div>
      <div className="relative flex justify-center items-center">
        <input
          placeholder="Type a message"
          type="text"
          onChange={(e) => setCurrentmsg(e.target.value)}
          value={currentmsg}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          className="w-full rounded border-gray-400 border-2"
        />
        <button
          type="button"
          onClick={sendMessage}
          className="absolute right-0 p-2 text-2xl text-gray-300 hover:text-gray-200 focus:text-gray-400"
        >
          &#9658;
        </button>
      </div>
    </div>
  );
};

export default Chat;
