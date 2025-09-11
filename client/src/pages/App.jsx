import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LogAnalysis from "../components/LogAnalysis";
import { IpContext } from "../components/IpContext";
import "../App.css";

function App() {
  const { setLatestIp } = useContext(IpContext);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  function getLogsPeriodically(setLogs, setError) {
    fetch("http://localhost:3000/get-log")
      .then((res) => res.json())
      .then((res) => {
        console.log("Raw log response:", res); // Debug log

        try {
          const parsed = JSON.parse(res.response);
          // Extract destination IP and log it
          const destIp = parsed.dest_ip || null;
          console.log("Destination IP:", destIp);
          setLatestIp(destIp);
          setLogs((prev) => [parsed, ...prev]);
          setError(null); // clear any old errors
        } catch (err) {
          setError("⚠️ Failed to parse log data");
        }
      })
      .catch((err) => {
        setError("🚨 Failed to fetch logs from server");
        console.error("Fetch error:", err); // Debug log
      });
  }

  useEffect(() => {
    const interval = setInterval(
      () => getLogsPeriodically(setLogs, setError),
      10000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page">
      <Navbar />
      <main className="content-container">
        <h2 style={{ marginBottom: "1rem" }}>Live SIEM Log Stream</h2>

        {error && (
          <div style={{ color: "red", marginBottom: "1.5em" }}>{error}</div>
        )}

        {!error && logs.length === 0 && (
          <div style={{ color: "yellow", marginBottom: "2em" }}>
            Waiting for logs...
          </div>
        )}

        {logs.map(
          (response, idx) =>
            response &&
            !response.error && <LogAnalysis key={idx} response={response} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
