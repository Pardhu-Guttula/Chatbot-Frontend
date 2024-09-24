import React from "react";
import Button from "react-bootstrap/Button";
import { BarChart, Download } from "lucide-react";
import botAvatar from "../assets/chatbot.jpg";
import userAvatar from "../assets/profile.png";

const Message = ({
  message,
  isMaximized,
  toggleLogsModal,
  toggleGraphModal,
  handleDownload,
}) => {
  const formatMessage = (content) => {
    const sections = content.split(
      "--------------------------------------------"
    );
    return sections
      .map((section, index) => {
        const trimmedSection = section.trim();
        if (trimmedSection === "") return null;

        const parts = trimmedSection.split("\n");
        const header = parts[0];
        const body = parts.slice(1).join("\n");

        return (
          <div key={index} className="formatted-section">
            <p className="section-header">{header}</p>
            {header.includes("SQL Query Ran") && (
              <pre className="sql-query">{body}</pre>
            )}
            {header.includes("SQL_Operator Messages") && (
              <pre className="sql-results">{body}</pre>
            )}
            {header.includes("Python Graph Generating Code Ran") && (
              <pre className="python-code">{body}</pre>
            )}
            {!header.includes("SQL Query Ran") &&
              !header.includes("SQL_Operator Messages") &&
              !header.includes("Python Graph Generating Code Ran") && (
                <p className="section-body">{body}</p>
              )}
          </div>
        );
      })
      .filter(Boolean);
  };

  return (
    <div>
      <div className={`message-container ${message.type}`}>
        <div className="message-wrapper">
          <img
            src={message.type === "user" ? userAvatar : botAvatar}
            alt={`${message.type} avatar`}
            className="avatar"
          />
          <div
            className={`message-content ${message.type} ${
              isMaximized ? "maximized" : ""
            }`}
          >
            {message.type === "bot" && typeof message.content === "string"
              ? formatMessage(message.content)
              : message.content}
          </div>
        </div>
      </div>
      {message.type === "bot" &&
        message.content !== "Hi, how can I help you?" && (
          <div className="bot-actions">
            <div className="action-buttons d-flex align-items-center">
              {message.showLogsButton && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-2 ms-5"
                  onClick={toggleLogsModal}
                >
                  See Logs
                </Button>
              )}
              {message.showGraph && message.graphUrl && (
                <>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => toggleGraphModal(message.graphUrl)}
                  >
                    <BarChart size={16} /> View Graph
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleDownload(message.graphUrl)}
                  >
                    <Download size={16} /> Download
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default Message;
