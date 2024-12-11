import React, { useState, useEffect } from "react";
import WebSocketService from "../services/websocket";
import ModalComponent from "./Modal";
import Message from "./Message";
import { saveToLocalStorage } from "../constants/LocalStorage";

interface MessageData {
  text: string;
  username: string;
  time: string;
}

const Chat: React.FC = () => {
  const [name, setName] = useState<string>(""); // Store user name
  const [message, setMessage] = useState<string>(""); //current msg
  const [messages, setMessages] = useState<MessageData[]>([]); // list mgs
  const [wsService, setWsService] = useState<WebSocketService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  //!send name and connect websocket
  const handleNameSubmit = (name: string): void => {
    if (name.trim() !== "") {
      setName(name);
      saveToLocalStorage("userName:", name);
      const ws = new WebSocketService(name, handleNewMessage);
      ws.connect();
      setWsService(ws);
      setIsModalOpen(false);
    }
  };

  const handleNewMessage = (newMessage: any): void => {
    const { type, data } = newMessage;

    if (type === "message") {
      let parsedMessage = "";
      try {
        // Parse JSOn string trong text
        const parsedData = JSON.parse(data.text);
        parsedMessage = parsedData.message || "";
      } catch (error) {
        console.error("Failed to parse text:", error);
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          username: data.username,
          text: parsedMessage,
          time: data.time,
        },
      ]);
    }
  };

  const handleSendMessage = (): void => {
    if (message.trim() !== "" && wsService) {
      wsService.sendMessage(message);
      setMessage("");
    }
  };

  useEffect(() => {
    if (name) {
      document.title = `Chat - ${name}`;
    } else {
      document.title = "Chat";
    }
  }, [name]);
  return (
    <>
      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNameSubmit}
      />

      {wsService && !isModalOpen && (
        <>
          <div className="flex justify-center w-full h-screen bg-slate-200">
            <div className="w-[500px] h-[560px]  bg-gray-100 rounded-lg mt-20 relative">
              <h1 className="text-center mt-3 mb-10 text-2xl font-semibold">
                {name ? `Wellcome ${name} to  Chat` : "Real-time Chat"}
              </h1>
              <div className="flex-1 overflow-auto max-h-[410px]">
                <div className="flex-1  overflow-hidden px-4 py-2">
                  {messages.map((msg, index) => (
                    <Message
                      key={index}
                      text={msg.text}
                      name={msg.username}
                      time={msg.time}
                    />
                  ))}
                </div>
              </div>
              <div className=" bg-white  w-full flex items-center justify-center   bottom-0 z-10 absolute px-3 py-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Chat;
