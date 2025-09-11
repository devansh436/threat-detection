function LogAnalysis({ response }) {
  const colors = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#22c55e",
  };

  const color = colors[response.threat_level] || "#6b7280";

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${color}1A, ${color}0D)`,
        backdropFilter: "blur(12px)",
        border: `1px solid ${color}30`,
        borderRadius: "16px",
        padding: "1rem",
        marginBottom: "1.5rem",
        boxShadow: `0 8px 32px ${color}15`,
        maxWidth: "600px",
        fontFamily: "'JetBrains Mono', monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 20% 30%, ${color}08 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <h3
            style={{
              color: "#f8fafc",
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 12px ${color}80`,
              }}
            />
            Network Analysis
          </h3>
          <span
            style={{
              background: color,
              color: response.threat_level === "Low" ? "#0f172a" : "#fff",
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {response.threat_level}
          </span>
        </div>

        {/* Content Grid */}
        <div style={{ display: "grid", gap: "0.6rem" }}>
          {/* Connection Details */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {[
              { label: "Source IP", value: response.source_ip },
              { label: "Destination IP", value: response.dest_ip },
            ].map(({ label, value }) => (
              <div key={label}>
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.875rem",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    color: "#e2e8f0",
                    fontWeight: "600",
                    background: "rgba(255, 255, 255, 0.05)",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Protocol & Score */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                }}
              >
                Protocol
              </div>
              <div
                style={{
                  color: "#e2e8f0",
                  fontWeight: "600",
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                {response.protocol}
              </div>
            </div>

            <div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                }}
              >
                Threat Score
              </div>
              <div
                style={{
                  color: color,
                  fontWeight: "700",
                  fontSize: "1.125rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {response.threat_score}
                <div
                  style={{
                    flex: 1,
                    height: "4px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${response.threat_score}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${color}, ${color}80)`,
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Threat Details */}
          {[
            {
              label: "Threat Type",
              value: response.threat_type,
              bg: "rgba(255, 255, 255, 0.05)",
            },
            {
              label: "Analysis Reason",
              value: response.reason,
              bg: "rgba(255, 255, 255, 0.03)",
              style: {
                fontFamily: "'Inter', system-ui, sans-serif",
                lineHeight: "1.6",
              },
            },
          ].map(({ label, value, bg, style }) => (
            <div key={label}>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  marginBottom: "0.25rem",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  color: label === "Analysis Reason" ? "#cbd5e1" : "#e2e8f0",
                  fontWeight: "600",
                  background: bg,
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  ...style,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LogAnalysis;
