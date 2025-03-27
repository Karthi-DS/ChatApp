import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});


io.on("connection",(socket)=>{

    socket.on("join_room",(data)=>{
        socket.join(data);
    })

    socket.on("send_message",(data)=>{
        console.log(data)
        socket.to(data.room).emit("receive_message",data);
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected. Id",socket.id)
    })

})




server.listen(3001, ()=>{
    console.log("Server is running on port 3000")
})