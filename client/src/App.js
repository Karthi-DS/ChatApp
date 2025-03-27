import './App.css';
import io from "socket.io-client";
import { useState } from 'react';
import Chat from './components/chat';

const socket = io.connect("http://localhost:3001");
function App() {
  const [username,setUsername] = useState("");
  const [room,setRoom] = useState("");

  const joinRoom = () =>{ 
    if(username !== "" && room !== ""){
      socket.emit("join_room",room);
    }
  }
  return (
    <div className='flex flex-col justify-center w-screen items-center h-screen'>
        <h3 className='text-2xl font-semibold text-blue-300 p-2  rounded'>Join Chat</h3>
      <div className="flex flex-wrap justify-center items-center gap-4 text-black mb-2">
          <input className='border-black border-2 rounded p-2' placeholder='Username' value={username} onChange={e=>setUsername(e.target.value)}></input>
          <input className='border-black border-2 rounded p-2' placeholder='Room' value={room} onChange={e=>setRoom(e.target.value)}></input>
      </div>
          <button onClick={joinRoom} className=' bg-blue-300 px-3 py-1 rounded hover:bg-blue-400 mb-4'>Join</button>     
      <div className='min-w-screen'>
            <Chat socket={socket} room={room} username={username}/>
          </div>
    </div>
  );
}

export default App;
