import { useState, useEffect, FormEventHandler } from 'react'
import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  receiveMessage: (message: string) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  message: (message: string) => void;
  receivemessage: (message: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}


function App() {
  const [socketId, setSocketId] = useState("");
  const [message, setMessage] = useState("");
  const socket:Socket<ServerToClientEvents, ClientToServerEvents>= io("http://localhost:3000");

  useEffect(() => {

    socket.on("connect", () => {
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
    <div className="flex flex-col w-screen">
      <header>
        Room Id: {socketId}
      </header>
      <div className="messages 
        overflow-auto
        border-black border-2
        h-72 w-full" />
      <form onSubmit={handleSendMessage}>
        <input className="border-black border-2 rounded" type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
      </form>
    </div>
  )
}

export default App
