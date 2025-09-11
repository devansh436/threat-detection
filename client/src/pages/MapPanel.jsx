import React, { useEffect, useRef, useState, useContext } from "react";
import { IpContext } from "../components/IpContext";
const worldMapImage = '../../world-map(1).png';


function geoToPixel(lat, lng, mapWidth = 800, mapHeight = 400) {
    const x = ((lng + 180) / 360) * mapWidth;
    const y = ((90 - lat) / 180) * mapHeight;
    return {
        x: Math.max(0, Math.min(mapWidth - 1, Math.round(x))),
        y: Math.max(0, Math.min(mapHeight - 1, Math.round(y)))
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
    const { ip } = useContext(IpContext);
    console.log('MapPanel IP:', ip); // Debug log
    const canvasRef = useRef(null);
    const [marker, setMarker] = useState(null);

    useEffect(() => {
        console.log('MapPanel useEffect triggered with IP:', ip); // Debug log
        let isMounted = true;
        async function showMarker() {
            if (!ip) {
                setMarker(null);
                return;
            }
            const location = await getIPLocation(ip);
            console.log('Geo location result:', location); // Debug log
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
        return () => { isMounted = false; };
    }, [ip]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
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
                    ctx.shadowColor = 'red';
                    ctx.shadowBlur = 18;
                    ctx.beginPath();
                    ctx.arc(marker.x, marker.y, 12, 0, 2 * Math.PI);
                    ctx.fillStyle = 'red';
                    ctx.globalAlpha = 0.7 * opacity;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.restore();
                    ctx.beginPath();
                    ctx.arc(marker.x, marker.y, 7, 0, 2 * Math.PI);
                    ctx.fillStyle = '#222';
                    ctx.fill();
                    ctx.strokeStyle = 'red';
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
        <div className="siem-map-card">
            <img src={worldMapImage} alt="World Map" className="siem-map-img" width={800} height={400} />
            <canvas ref={canvasRef} width={800} height={400} className="siem-map-canvas" />
        </div>
    );
};

export default MapPanel;
