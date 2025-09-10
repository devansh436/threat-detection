// TODO: 
// s1. setTimeout(2.5 seconds)
// s2. fetch req for retrieving log 

// Gemini Response Format (JSON):
//   {
//     "source_ip" : <src_ip>,
//     "dest_ip" : <dest_ip>,
//     "protocol": <ip | tcp>,
//     "threat_score": <number>,
//     "threat_level": "<Low | Medium | High>",
//     "reason": "<short explanation>",
//     "threat_type": <attack_name | normal_traffic>,
//   } 


import { useState } from "react";

function LogForm({ onSubmit }) {
  const [input, setInput] = useState("");

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
