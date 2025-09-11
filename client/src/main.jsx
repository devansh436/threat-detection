import { StrictMode, useEffect, useState, useContext } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App";
import About from "./pages/About";
import Analysis from "./pages/Analysis";
import MapPanel from "./pages/MapPanel";
import { IpProvider, IpContext } from "./components/IpContext";
import "./index.css";

function Main() {
  const { latestIp, setLatestIp } = useContext(IpContext);
  console.log("Main IP:", latestIp); // Debug log

  return (
    <StrictMode>
      <IpProvider>

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/about" element={<About />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/map" element={<MapPanel />} />
          </Routes>
        </BrowserRouter>
      </IpProvider>

    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Main />);
