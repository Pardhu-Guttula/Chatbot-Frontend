import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const LogsModal = ({ show, onHide, logMessages }) => {
  const trimLongLines = (text, maxLength = 100) => {
    return text
      .split("\n")
      .map((line) =>
        line.length > maxLength ? line.substring(0, maxLength) + "..." : line
      )
      .join("\n");
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Logs</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="logs-container">
          {logMessages.map((log, index) => (
            <pre key={index} className="log-entry">
              {trimLongLines(log)}
            </pre>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogsModal;
