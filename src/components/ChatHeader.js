import React from "react";
import Button from "react-bootstrap/Button";
import { Maximize2, Minimize2 } from "lucide-react";
import closeIcon from "../assets/close.png";

const ChatHeader = ({ isMaximized, toggleMaximize, toggleChat }) => (
  <div className="chat-header d-flex justify-content-between align-items-center p-2 text-white">
    <h5 className="mb-0">CloudOptics</h5>
    <div className="d-flex align-items-center">
      <Button
        variant="link"
        className="p-0 mx-2 text-white"
        onClick={toggleMaximize}
      >
        {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </Button>
      <Button variant="link" className="p-0" onClick={toggleChat}>
        <img
          src={closeIcon}
          alt="Close Icon"
          className="header-button"
          style={{ width: "20px", height: "20px" }}
        />
      </Button>
    </div>
  </div>
);

export default ChatHeader;
