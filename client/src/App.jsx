// import { useState } from 'react'
import { useEffect, useMemo, useState } from "react"
import React from "react"
import {io} from "socket.io-client"
import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function App() {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  const socket =  useMemo(() => io("http://localhost:3000"),[])
  useEffect(() => {
    socket.on("connect" , () => {
      setSocketId(socket.id)

      socket.on("recieve-message" , (data) => {
        console.log("recived message" , data)
        setMessages((messages) => [...messages, data]);
      })
    })

    // return () => {
    //   socket.disconnect()
    // }
  } , [])
  function handleSubmit(e) {
    e.preventDefault();
    socket.emit("message" , {message, room})
    setMessage("")
  }

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  return (
    <Container
    maxWidth="sm"
    sx={{
      backgroundColor: "white",
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 4,
    }}
  >
    <Typography variant="h6" component="div" style={{ color: "black" }}>
  Socket ID: {socketID}
</Typography>

    <form onSubmit={joinRoomHandler} style={{ width: "100%", marginBottom: 16 }}>
      <Typography variant="h5" component="h5" gutterBottom>
        Join Room
      </Typography>
      <TextField
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        label="Room Name"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Join
      </Button>
    </form>

    <form onSubmit={handleSubmit} style={{ width: "100%", marginBottom: 16 }}>
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        label="Message"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        label="Room"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Send
      </Button>
    </form>

    <Stack spacing={2} sx={{ width: "100%" }}>
      {messages.map((m, i) => (
        <Typography key={i} variant="body1" component="div" gutterBottom style={{ color: "black" }}>
          {m}
        </Typography>
      ))}
    </Stack>
  </Container>
  )
}

export default App
