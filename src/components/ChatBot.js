import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import chatIcon from "../assets/chatIcon.png";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import Suggestions from "./Suggestions";
import LogsModal from "./LogsModal";
import GraphModal from "./GraphModal";
import BouncingDotsLoader from "./BouncingDotsLoader";
import "./Chatbot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [partialResponse, setPartialResponse] = useState("");
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [logMessages, setLogMessages] = useState([]);
  const [showGraphModal, setShowGraphModal] = useState(false);
  const [currentGraphUrl, setCurrentGraphUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      connectWebSocket();
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ type: "bot", content: "Hi, how can I help you?" }]);
    }
    scrollToBottom();
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const connectWebSocket = () => {
    socketRef.current = new WebSocket("ws://172.210.47.154:8000/getanswer");

    socketRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socketRef.current.onmessage = (event) => {
      console.log("Received message from server:", event.data);
      const graphUrl = extractGraphUrlFromEvent(event.data);
      if (graphUrl) {
        setCurrentGraphUrl(graphUrl);
        setMessages((prevMessages) =>
          prevMessages.map((msg, index) =>
            index === prevMessages.length - 1 && msg.type === "bot"
              ? { ...msg, showGraph: true, graphUrl }
              : msg
          )
        );
      }

      setPartialResponse((prev) => prev + event.data);
      setLogMessages((prevLogs) => [...prevLogs, event.data]);

      if (event.data.includes("Final Answer")) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "bot",
            content: partialResponse + event.data,
            sqlData: event.data.includes("SQL Query Ran")
              ? JSON.parse(event.data).sqlData
              : null,
            showGraph: false,
            graphUrl: null,
            showLogsButton: true,
          },
        ]);
        setPartialResponse("");
        setIsLoading(false);
      }
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
      setPartialResponse("");
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const extractGraphUrlFromEvent = (eventData) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = eventData.match(urlRegex);
    return matches ? matches[matches.length - 1] : null;
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setMessages([]);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const sendMessage = async (message) => {
    if (message.trim() === "") return;

    const newMessages = [...messages, { type: "user", content: message }];
    setMessages(newMessages);
    setIsLoading(true);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          message: message,
          chat_history: newMessages.map((msg) => ({ content: msg.content })),
        })
      );
    } else {
      console.error("WebSocket is not connected");
      setMessages([
        ...newMessages,
        {
          type: "bot",
          content:
            "Sorry, I'm having trouble connecting to the server. Please try again later.",
        },
      ]);
      setIsLoading(false);
    }
  };

  const toggleLogsModal = () => {
    setShowLogsModal(!showLogsModal);
  };

  const toggleGraphModal = (graphUrl) => {
    setCurrentGraphUrl(graphUrl);
    setShowGraphModal(!showGraphModal);
  };

  const handleDownload = (graphUrl) => {
    if (graphUrl) {
      const link = document.createElement("a");
      link.href = graphUrl;
      link.download = "graph.jpeg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="chatbot-container">
      <Button variant="link" onClick={toggleChat}>
        <img src={chatIcon} alt="Chat Icon" className="chat-icon" />
      </Button>

      {isOpen && (
        <div className={`chat-window ${isMaximized ? "maximized" : ""}`}>
          <ChatHeader
            isMaximized={isMaximized}
            toggleMaximize={toggleMaximize}
            toggleChat={toggleChat}
          />
          <div className="chat-messages-container">
            <MessageList
              messages={messages}
              isMaximized={isMaximized}
              toggleLogsModal={toggleLogsModal}
              toggleGraphModal={toggleGraphModal}
              handleDownload={handleDownload}
            />
            {messages.length === 1 && (
              <Suggestions onSuggestionClick={sendMessage} />
            )}
            <div ref={messagesEndRef} />
          </div>
          {isLoading && (
            <div className="loader-container">
              <BouncingDotsLoader />
            </div>
          )}
          <ChatInput onSubmit={sendMessage} />
          <LogsModal
            show={showLogsModal}
            onHide={toggleLogsModal}
            logMessages={logMessages}
          />
          <GraphModal
            show={showGraphModal}
            onHide={() => setShowGraphModal(false)}
            graphUrl={currentGraphUrl}
          />
        </div>
      )}
    </div>
  );
};

export default ChatBot;
