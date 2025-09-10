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
          const parsed = JSON.parse(res.response);
          setResponse(parsed);
        } catch (err) {
          console.error(err);
          setResponse({ error: "Invalid response format" });
        }
      });
  }, [inputLog]);

  return (
    <div className="page">
      <Navbar />
      <main className="content-container">
        <LogForm onSubmit={setInputLog} />
        <AnalysisCard response={response} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
