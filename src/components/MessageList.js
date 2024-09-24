import React from "react";
import Message from "./Message";

const MessageList = ({
  messages,
  isMaximized,
  toggleLogsModal,
  toggleGraphModal,
  handleDownload,
}) => (
  <div className="chat-messages">
    {messages.map((message, index) => (
      <Message
        key={index}
        message={message}
        isMaximized={isMaximized}
        toggleLogsModal={toggleLogsModal}
        toggleGraphModal={toggleGraphModal}
        handleDownload={handleDownload}
      />
    ))}
  </div>
);
export default MessageList;
