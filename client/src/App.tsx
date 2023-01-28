import { useState, useEffect, FormEventHandler } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  receiveMessage: (message: string) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  message: (arg: string) => void;
  receivemessage: (arg: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}


function App() {
  const [socketId, setSocketId] = useState("");
  const [message, setMessage] = useState("");
  const socket:Socket<ServerToClientEvents, ClientToServerEvents>= io("http://localhost:3000");
  console.log("id", socketId);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("my id is ", socket.id) 
      setSocketId(socket.id);
    })
    socket.on("receiveMessage", (data) => {
      const messagesElem = document.querySelector(".messages");
      const newMessageElem = document.createElement("p");
      newMessageElem.innerText = data;
      if (messagesElem) {
        messagesElem.append(newMessageElem);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
    }
  }, [])

  const handleSendMessage: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage("");
  }

  return (
    <div className="App">

      <header>
        Room Id: {socketId}
      </header>

      <div className="messages"/>
      <form onSubmit={handleSendMessage}>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
      </form>
    </div>
  )
}

export default App
