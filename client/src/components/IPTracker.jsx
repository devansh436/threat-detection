import "../App.css";
import Navbar from "./Navbar";
import { useState } from "react";

const IPTracker = () => {
  const [ipCounts, setIpCounts] = useState({});
  const [newIp, setNewIp] = useState("");

  const addIP = () => {
    if (newIp.trim() && isValidIP(newIp.trim())) {
      const ip = newIp.trim();
      setIpCounts((prev) => ({
        ...prev,
        [ip]: (prev[ip] || 0) + 1,
      }));
      setNewIp("");
    } else {
      alert("Please enter a valid IP address");
    }
  };

  const isValidIP = (ip) => {
    const ipRegex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addIP();
    }
  };

  const clearData = () => {
    setIpCounts({});
  };

  // Convert data for chart
  const chartData = Object.entries(ipCounts).map(([ip, count]) => ({
    ip,
    count,
  }));

  const maxCount =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.count)) : 0;

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  };

  const infoCardStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    padding: "32px",
  };

  const titleStyle = {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "32px",
    textAlign: "center",
    background: "linear-gradient(90deg, #2563eb, #7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const inputContainerStyle = {
    marginBottom: "32px",
    background: "#f9fafb",
    borderRadius: "8px",
    padding: "24px",
  };

  const inputStyle = {
    width: "70%",
    padding: "12px 16px",
    border: "2px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    marginRight: "12px",
  };

  const buttonStyle = {
    padding: "12px 24px",
    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    marginRight: "8px",
  };

  const clearButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(90deg, #ef4444, #ec4899)",
  };

  const statsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  };

  const statinfoCardStyle = {
    padding: "24px",
    borderRadius: "12px",
  };

  return (
    <div>
      <div className="form-container">
        <div className="infoCard">
          <h2 style={{textAlign:'center'}}>IP Address Tracker</h2>
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              addIP();
            }}
          >
            <input
              type="text"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter IP address (e.g., 192.168.1.1)"
            />
            <button type="submit">Add IP</button>
            <button type="button" onClick={clearData}>
              Clear All
            </button>
          </form>
          <div style={{ marginTop: "32px" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
              <div className="infoCard low" style={{ flex: 1 }}>
                <h3>Total IPs</h3>
                <p>{Object.keys(ipCounts).length}</p>
              </div>
              <div className="infoCard medium" style={{ flex: 1 }}>
                <h3>Total Requests</h3>
                <p>{Object.values(ipCounts).reduce((a, b) => a + b, 0)}</p>
              </div>
              <div className="infoCard high" style={{ flex: 1 }}>
                <h3>Most Active IP</h3>
                <p>
                  {chartData.length > 0
                    ? chartData.reduce(
                        (max, item) => (item.count > max.count ? item : max),
                        chartData[0]
                      ).ip
                    : "None"}
                </p>
              </div>
            </div>
            {/* Graph Section */}
            {chartData.length > 0 && (
              <div className="infoCard" style={{ marginTop: "24px" }}>
                <h3 style={{ marginBottom: "20px", textAlign: "center" }}>
                  IP Address Request Distribution
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "center",
                    height: "300px",
                    gap: "8px",
                    padding: "20px",
                    borderBottom: "2px solid #e5e7eb",
                  }}
                >
                  {chartData
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10) // Show top 10 IPs in graph
                    .map(({ ip, count }) => {
                      const barHeight = Math.max((count / maxCount) * 250, 20);

                      return (
                        <div
                          key={ip}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            minWidth: "60px",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: `${barHeight}px`,
                              background:
                                "linear-gradient(to top, #3b82f6, #60a5fa)",
                              borderRadius: "4px 4px 0 0",
                              position: "relative",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                            }}
                            title={`${ip}: ${count} requests`}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: "-25px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontSize: "10px",
                                fontWeight: "bold",
                                color: "#374151",
                              }}
                            >
                              {count}
                            </div>
                          </div>
                          <div
                            style={{
                              marginTop: "8px",
                              fontSize: "9px",
                              color: "#6b7280",
                              transform: "rotate(45deg)",
                              transformOrigin: "center",
                              whiteSpace: "nowrap",
                              maxWidth: "80px",
                            }}
                          >
                            {ip}
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#6b7280",
                    marginTop: "10px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                >
                  <span>0 requests</span>
                  <span>Max: {maxCount} requests</span>
                </div>
              </div>
            )}
            {/* IP List Section */}
            {chartData.length > 0 && (
              <div
                style={{
                  marginTop: "16px",
                  background: "#475569",
                  borderRadius: "8px",
                  padding: "12px",
                  height: "350px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#e2e8f0",
                    marginBottom: "8px",
                    flexShrink: 0,
                  }}
                >
                  IP Details ({chartData.length} IPs)
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    flex: 1,
                    overflowY: "auto",
                    paddingRight: "8px",
                  }}
                >
                  {chartData
                    .sort((a, b) => b.count - a.count)
                    .map(({ ip, count }) => (
                      <div
                        key={ip}
                        style={{
                          background: "#334155",
                          padding: "8px",
                          borderRadius: "4px",
                          borderLeft: "3px solid #60a5fa",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            fontWeight: "bold",
                            color: "#e2e8f0",
                            margin: 0,
                            fontSize: "12px",
                          }}
                        >
                          {ip}
                        </p>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#60a5fa",
                          }}
                        >
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPTracker;
