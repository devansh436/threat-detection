import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [inputLog, setInputLog] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (inputLog == null) return;

    fetch("http://localhost:3000/gemini-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputLog }),
    })
      .then((res) => res.json())
      .then((res) => {
        try {
          const parsed = JSON.parse(res.response); // make sure it’s JSON
          setResponse(parsed);
        } catch (err) {
          console.log(err);
          setResponse({ error: "Invalid response format" });
        }
      });
  }, [inputLog]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputLog(input);
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Paste log entry here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Analyze</button>
      </form>

      {!response && <p className="waiting">Waiting for analysis...</p>}

      {response && !response.error && (
        <div className={`card ${response.threat_level.toLowerCase()}`}>
          <h2>Threat Analysis</h2>
          <p>
            <strong>Score:</strong> {response.threat_score}/100
          </p>
          <p>
            <strong>Level:</strong>{" "}
            <span className="level">{response.threat_level}</span>
          </p>
          <p>
            <strong>Reason:</strong> {response.reason}
          </p>
        </div>
      )}

      {response?.error && <p className="error">{response.error}</p>}
    </div>
  );
}

export default App;
