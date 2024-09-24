import React from "react";
import Button from "react-bootstrap/Button";

const Suggestions = ({ onSuggestionClick }) => {
  const suggestions = [
    "what are the top 5 subscriptions by total cost in september 2024?",
  ];

  return (
    <div className="suggestions">
      <p>Here are some suggestions:</p>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline-secondary"
          size="sm"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
};

export default Suggestions;
