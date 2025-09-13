import React, { useEffect, useRef, useState } from "react";
const worldMapImage = "../../world-map(1).png";

function geoToPixel(lat, lng, mapWidth = 800, mapHeight = 400) {
  const x = ((lng + 180) / 360) * mapWidth;
  const y = ((90 - lat) / 180) * mapHeight;
  return {
    x: Math.max(0, Math.min(mapWidth - 1, Math.round(x))),
    y: Math.max(0, Math.min(mapHeight - 1, Math.round(y))),
  };
}

async function getIPLocation(ip) {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    if (data.latitude && data.longitude && !data.error) {
      return { lat: data.latitude, lon: data.longitude };
    }
  } catch { }
  return null;
}

const MapPanel = () => {
  const canvasRef = useRef(null);
  const [marker, setMarker] = useState(null);
  const [latestIp, setLatestIp] = useState(null);

  // Poll latest log every 5 seconds
  useEffect(() => {
    let interval;
    async function fetchLatestIp() {
      try {
        const response = await fetch("http://localhost:3000/logs");
        console.log("Fetched logs:", response);
        const data = await response.json();
        if (data.logs && data.logs.length > 0) {
          // Get the last log entry (most recent)
          const latestLog = data.logs[0];
          console.log("Latest log object:", latestLog);
          // Extract Destination IP correctly
          let ip = null;
          if (latestLog.log) {
            ip = latestLog.log["Destination IP"] || latestLog.log["dest_ip"];
          }
          console.log("Extracted Destination IP:", ip);
          setLatestIp(ip);
        }
      } catch (err) {
        setLatestIp(null);
      }
    }
    fetchLatestIp();
    interval = setInterval(fetchLatestIp, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function showMarker() {
      if (!latestIp) {
        setMarker(null);
        return;
      }
      const location = await getIPLocation(latestIp);
      if (location && location.lat && location.lon) {
        const pixel = geoToPixel(location.lat, location.lon);
        setMarker({ x: pixel.x, y: pixel.y, created: Date.now() });
        setTimeout(() => {
          if (isMounted) setMarker(null);
        }, 2000);
      } else {
        setMarker(null);
      }
    }
    showMarker();
    return () => {
      isMounted = false;
    };
  }, [latestIp]);

  useEffect(() => {
    console.log("Marker updated:", marker);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let anim;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (marker) {
        const now = Date.now();
        const age = (now - marker.created) / 1000;
        let opacity = 1;
        if (age > 2) opacity = 0;
        else opacity = 1 - age / 2;
        if (opacity > 0) {
          ctx.save();
          ctx.shadowColor = "red";
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(marker.x, marker.y, 12, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.globalAlpha = 0.7 * opacity;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.restore();
          ctx.beginPath();
          ctx.arc(marker.x, marker.y, 7, 0, 2 * Math.PI);
          ctx.fillStyle = "#222";
          ctx.fill();
          ctx.strokeStyle = "red";
          ctx.lineWidth = 3;
          ctx.globalAlpha = opacity;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      anim = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(anim);
  }, [marker]);

  return (
    <div
      className="siem-map-card"
      style={{
        position: "relative", // allows stacking
        width: 1120,
        height: 600,
        margin: "90px auto", // centers horizontally

      }}
    >
      <img
        src={worldMapImage}
        alt="World Map"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          display: "block", // removes extra bottom space
        }}
      />
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{
          position: "absolute", // stack on top of image
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

export default MapPanel;
