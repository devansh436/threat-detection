import { useState } from "react";

function LogForm({ onSubmit }) {
  const [input, setInput] = useState("");

  // TODO: setTimeout(5 seconds)-> fetch req for retrieving log

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        placeholder="Paste log entry here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">Analyze</button>
    </form>
  );
}

export default LogForm;
