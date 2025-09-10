function AnalysisCard({ response }) {
  if (!response) return <p className="waiting">Waiting for analysis...</p>;
  if (response.error) return <p className="error">{response.error}</p>;

  return (
    <div className={`card ${response.threat_level.toLowerCase()}`}>
      <h2>Threat Analysis</h2>
      <p>
        <strong>Score:</strong> {response.threat_score}/100
      </p>

      {/* Progress Bar */}
      <div className="score-bar">
        <div
          className={`score-fill ${response.threat_level.toLowerCase()}`}
          style={{ width: `${response.threat_score}%` }}
        >
          {response.threat_score}%
        </div>
      </div>

      <p>
        <strong>Level:</strong>{" "}
        <span className="level">{response.threat_level}</span>
      </p>
      <p>
        <strong>Reason:</strong> {response.reason}
      </p>
    </div>
  );
}

export default AnalysisCard;
