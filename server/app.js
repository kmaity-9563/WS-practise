import express from "express"
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'

const port = 3000
const app = express()
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
})


io.on("connect", (socket) => {
    socket.on("message", ({message , room}) => {
        console.log("data", message)
        socket.to(room).emit("recieve-message", message)
    })

    // socket.broadcast.emit("welcome", "welcome to my code")

    socket.on("join-room" ,  (room) => {
        socket.join(room)
        console.log("joined room" , room)
    })

    // socket.on("disconnect" , () => {
    //     console.log("disconnected" , socket.id)
    // })
})


app.get("/", (req, res) => {
    res.send("hellooo")
})

server.listen(port, () => {
    console.log("port listening at 3000")
})

