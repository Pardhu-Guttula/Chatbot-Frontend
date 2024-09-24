import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

const ChatInput = ({ onSubmit }) => {
  const [inputMessage, setInputMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== "") {
      onSubmit(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="chat-input-form">
      <InputGroup>
        <Form.Control
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="custom-input"
        />
        <Button className="send-button" type="submit">
          Send
        </Button>
      </InputGroup>
    </Form>
  );
};

export default ChatInput;
