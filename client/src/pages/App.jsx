import { useState, useEffect, useContext } from "react";
import LogAnalysis from "../components/LogAnalysis";
import { IpContext } from "../components/IpContext";
import PieChart from "../components/PieChart";
import "../App.css";
import IPTracker from "../components/IPTracker";

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
      7000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page">
      <div
        className="content-container"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2vw",
          alignItems: "stretch",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1rem",
          boxSizing: "border-box",
          minHeight: "70vh",
        }}
      >
        {/* Log Analysis Receiver Container */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            maxWidth: "50%",
            background: "rgba(17,24,39,0.85)",
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
            padding: "1.5rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            overflowY: "auto",
            height: "auto",
          }}
        >
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
        </div>

        {/* Second Section */}
        <div
          style={{
            flex: 1,
            flexDirection: "column",
            minWidth: 0,
            maxWidth: "50%",
            background: "rgba(17,24,39,0.85)",
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
            padding: "1.5rem 1rem",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            overflow: "hidden",
            height: "auto",
            maxHeight: "2450px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <PieChart threatAnalysisData={logs} />
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              marginTop: "32px",
            }}
          >
            <IPTracker />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
