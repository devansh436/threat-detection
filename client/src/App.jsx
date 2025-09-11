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
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:3000/get-log")
        .then((res) => res.json())
        .then((res) => {
          try {
            const parsed = JSON.parse(res.response);
            setLogs((prev) => [parsed, ...prev]);
          } catch (err) {
            // Optionally show error log
          }
        })
        .catch(() => {
          // Optionally show error log
        });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page">
      <Navbar />
      <main className="content-container">
        <h2 style={{ marginBottom: '1rem' }}>Live SIEM Log Stream</h2>
        <div>
          {logs.length === 0 ? (
            <div style={{ color: 'red', marginBottom: '2em' }}>No valid log data or error.</div>
          ) : (
            logs.map((response, idx) =>
              response && !response.error ? (
                <div key={idx} style={{
                  background: '#222', color: '#fff', borderRadius: '8px', padding: '1.5em', marginBottom: '2em', boxShadow: '0 2px 8px #0002', maxWidth: '500px', fontFamily: 'monospace'
                }}>
                  <div><b>Source IP:</b> {response.source_ip}</div>
                  <div><b>Destination IP:</b> {response.dest_ip}</div>
                  <div><b>Protocol:</b> {response.protocol}</div>
                  <div><b>Threat Score:</b> <span style={{ color: response.threat_level === 'High' ? 'red' : response.threat_level === 'Medium' ? 'orange' : 'lime' }}>{response.threat_score}</span></div>
                  <div><b>Threat Level:</b> <span style={{ color: response.threat_level === 'High' ? 'red' : response.threat_level === 'Medium' ? 'orange' : 'lime' }}>{response.threat_level}</span></div>
                  <div><b>Threat Type:</b> {response.threat_type}</div>
                  <div><b>Reason:</b> {response.reason}</div>
                </div>
              ) : null
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
