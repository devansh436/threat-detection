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
        try {
          const parsed = JSON.parse(res.response);
          const destIp = parsed.dest_ip || null;
          setLatestIp(destIp);
          setLogs((prev) => [parsed, ...prev]);
          setError(null);
        } catch (err) {
          setError("⚠️ Failed to parse log data");
        }
      })
      .catch(() => {
        setError("🚨 Failed to fetch logs from server");
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
          flexDirection: "row", // 🔥 left + right layout
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
        {/* Part 1: Log Receiver */}
        <div className="analysis-box"
          style={{
            flex: 1,
            minWidth: 0,
            maxWidth: "45%",
            borderRadius: "16px",
            padding: "1.5rem 1rem",
            display: "block",
            flexDirection: "column",
            gap: "1rem",
            height: "600px",
            maxHeight: "1200px", // 🔥 fixed max height
            overflowY: "auto", // 🔥 scroll inside
          }}
        >
          <h2 style={{ textAlign:"center", marginBottom: "1rem" }}>Live SIEM Log Stream</h2>

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

        {/* Part 2: Right side (stacked vertically) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            maxWidth: "50%",
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            overflow: "hidden",
            height: "auto",
            maxHeight: "2450px",
          }}
        >
          <div style={{ width: "100%" }}>
            <PieChart threatAnalysisData={logs} />
          </div>

          <div style={{ width: "100%", marginTop: "32px" }}>
            <IPTracker threatAnalysisData={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
