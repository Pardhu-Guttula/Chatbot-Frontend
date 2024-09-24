import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const GraphModal = ({ show, onHide, graphUrl }) => (
  <Modal show={show} onHide={onHide} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Graph View</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <img src={graphUrl} alt="Graph" style={{ width: "100%" }} />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default GraphModal;
