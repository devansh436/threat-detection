import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LogForm from "./components/LogForm";
import AnalysisCard from "./components/AnalysisCard";
import "./App.css";



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



function App() {
  const [inputLog, setInputLog] = useState(null);
  const [response, setResponse] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:3000/logs")
        .then((res) => res.json())
        .then((res) => {
          if (res.logs && Array.isArray(res.logs)) {
            // Each log: { log: originalLogObj, verdict: modelVerdict, createdAt }
            // Use verdict for display (same format as before)
            setLogs(res.logs.map(l => l.verdict));
          }
        });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page">
      <Navbar />
      <main className="content-container">
        <LogForm onSubmit={setInputLog} />
        {/* Render all logs from MongoDB */}
        {logs.length > 0 ? (
          logs.map((log, idx) => (
            <AnalysisCard key={idx} response={log} />
          ))
        ) : (
          <div>No logs found.</div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
