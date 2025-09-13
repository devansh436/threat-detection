import express from "express"; // needs "type": "module"
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
// --- Endpoint Log Schemas and Models ---
const endpointLogSchema = new mongoose.Schema(
  {
    // This schema is intentionally flexible (strict: false) to allow any log fields from endpoints.
    // You can add specific fields here if you want validation or indexing.
  },
  { strict: false, timestamps: true }
);

const FirewallLogModel = mongoose.model("FirewallLog", endpointLogSchema);
const WebserverLogModel = mongoose.model("WebserverLog", endpointLogSchema);
const IDSLogModel = mongoose.model("IDSLog", endpointLogSchema);
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import axios from "axios";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function getGeminiResponse(inputLog) {
  const prompt = `You are a cybersecurity threat detection assistant. 
  I will provide you with raw system logs. 
  Your task is to:
  1. Analyze the logs for suspicious or malicious activity.  
  2. Assign a threat score from 0 to 100, where:
    - 0 = No threat
    - 1 to 30 = Low threat
    - 31 to 70 = Medium threat
    - 71 to 100 = High threat
  3. Explain briefly in 1-2 lines why you assigned this score.

  Input Log:
  ${inputLog}

  Output Format (JSON):
  {
    "source_ip" : <src_ip>,
    "dest_ip" : <dest_ip>,
    "protocol": <ip | tcp>,
    "threat_score": <number>,
    "threat_level": "<Low | Medium | High>",
    "reason": "<short explanation>",
    "threat_type": <attack_name | normal_traffic>,
  }
  DO NOT USE MARKDOWN TEXT TO REPRESENT JSON, WRITE JSON IN PLAINTEXT.
  `;

  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// --- MongoDB connection ---
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/threat_logs";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Log schema
const logSchema = new mongoose.Schema({
  log: Object,
  verdict: Object,
  createdAt: { type: Date, default: Date.now },
});
const LogModel = mongoose.model("Log", logSchema);

app.get("/", (req, res) => {
  res.send({ data: "Hello, Express!" });
});

app.get("/get-log", async (req, res) => {
  const logFile = path.join(__dirname, "logs", "demo1000.csv");
  try {
    const csvData = fs.readFileSync(logFile, "utf8");
    const logs = parse(csvData, { columns: true, skip_empty_lines: true });
    if (logs.length === 0)
      return res
        .status(404)
        .json({ response: null, log: null, error: "No logs found" });
    // Pick a random log
    const randomLogObj = logs[Math.floor(Math.random() * logs.length)];
    // Convert log object to string for Gemini
    const randomLog = Object.entries(randomLogObj)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    // Send to Gemini
    try {
      const output = await getGeminiResponse(randomLog);
      // Try to parse Gemini output as JSON
      let verdict = null;
      try {
        verdict = JSON.parse(output);
      } catch {
        verdict = { raw: output };
      }
      // Store in MongoDB
      await LogModel.create({ log: randomLogObj, verdict });
      res.json({ response: output, log: randomLog });
    } catch (geminiErr) {
      console.error(geminiErr);
      res.json({
        response: null,
        log: randomLog,
        error: geminiErr.message || "Gemini error",
      });
    }
  } catch (err) {
    console.error(err);
    res.json({
      response: null,
      log: null,
      error: "Failed to process log file.",
    });
  }
});

//custome model prediction route
app.post("/api/predict", async (req, res) => {
  try {
    // Forward request to Python service
    const response = await axios.post("http://127.0.0.1:5000/predict", {
      features: req.body.features,
    });

    res.json(response.data); // send back prediction to frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/logs", async (req, res) => {
  try {
    const logs = await LogModel.find().sort({ createdAt: -1 }).limit(100);
    res.json({ logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs from MongoDB." });
  }
});

// --- CUSTOM ML LOGGING SECTION ---
// This section fetches one log from each endpoint collection (Firewall, Webserver, IDS), merges them,
// and sends the merged log to the ML model for prediction. The result is stored in the main LogModel.
setInterval(async () => {
  try {
    // --- Fetch one log from each endpoint collection ---
    // You must define these Mongoose models elsewhere in your code
    // Example: const FirewallLogModel = mongoose.model('FirewallLog', logSchema);
    // Example: const WebserverLogModel = mongoose.model('WebserverLog', logSchema);
    // Example: const IDSLogModel = mongoose.model('IDSLog', logSchema);

    // Fetch one log from each endpoint collection
    const firewallLog = await FirewallLogModel.findOne().sort({ createdAt: 1 });
    const webserverLog = await WebserverLogModel.findOne().sort({
      createdAt: 1,
    });
    const idsLog = await IDSLogModel.findOne().sort({ createdAt: 1 });

    // If all are missing, skip
    if (!firewallLog && !webserverLog && !idsLog) return;

    // Merge logs: take non-null values from each, prioritizing leftmost
    const mergedLog = {
      ...firewallLog?._doc,
      ...webserverLog?._doc,
      ...idsLog?._doc,
    };

    // --- Extract only numeric features for ML model ---
    const featureColumns = [
      "Source Port",
      "Destination Port",
      "Protocol",
      "Flow Duration",
      "Total Fwd Packets",
      "Total Backward Packets",
      "Total Length of Fwd Packets",
      "Total Length of Bwd Packets",
      "Fwd Packet Length Max",
      "Fwd Packet Length Min",
      "Fwd Packet Length Mean",
      "Fwd Packet Length Std",
      "Bwd Packet Length Max",
      "Bwd Packet Length Min",
      "Bwd Packet Length Mean",
      "Bwd Packet Length Std",
      "Flow Bytes/s",
      "Flow Packets/s",
      "Flow IAT Mean",
      "Flow IAT Std",
      "Flow IAT Max",
      "Flow IAT Min",
      "Fwd IAT Total",
      "Fwd IAT Mean",
      "Fwd IAT Std",
      "Fwd IAT Max",
      "Fwd IAT Min",
      "Bwd IAT Total",
      "Bwd IAT Mean",
      "Bwd IAT Std",
      "Bwd IAT Max",
      "Bwd IAT Min",
      "Fwd PSH Flags",
      "Bwd PSH Flags",
      "Fwd URG Flags",
      "Bwd URG Flags",
      "Fwd Header Length",
      "Bwd Header Length",
      "Fwd Packets/s",
      "Bwd Packets/s",
      "Min Packet Length",
      "Max Packet Length",
      "Packet Length Mean",
      "Packet Length Std",
      "Packet Length Variance",
      "FIN Flag Count",
      "SYN Flag Count",
      "RST Flag Count",
      "PSH Flag Count",
      "ACK Flag Count",
      "URG Flag Count",
      "CWE Flag Count",
      "ECE Flag Count",
      "Down/Up Ratio",
      "Average Packet Size",
      "Avg Fwd Segment Size",
      "Avg Bwd Segment Size",
      "Fwd Header Length.1",
      "Fwd Avg Bytes/Bulk",
      "Fwd Avg Packets/Bulk",
      "Fwd Avg Bulk Rate",
      "Bwd Avg Bytes/Bulk",
      "Bwd Avg Packets/Bulk",
      "Bwd Avg Bulk Rate",
      "Subflow Fwd Packets",
      "Subflow Fwd Bytes",
      "Subflow Bwd Packets",
      "Subflow Bwd Bytes",
      "Init_Win_bytes_forward",
      "Init_Win_bytes_backward",
      "act_data_pkt_fwd",
      "min_seg_size_forward",
      "Active Mean",
      "Active Std",
      "Active Max",
      "Active Min",
      "Idle Mean",
      "Idle Std",
      "Idle Max",
      "Idle Min",
    ];
    const features = featureColumns.map((col) => {
      let val = mergedLog[col];
      return typeof val === "string" ? Number(val) : val;
    });

    let prediction = 0;
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        features,
      });
      prediction = response.data.prediction[0];
    } catch (mlErr) {
      console.error("ML service error:", mlErr.message);
      prediction = 1; // treat as benign if ML service fails
    }

    // --- Handle prediction and store in MongoDB ---
    if (prediction === 0) {
      await LogModel.create({
        log: mergedLog,
        verdict: {
          threat_score: 0,
          threat_type: "normal_traffic",
          reason: "Classified as benign (0) by custom ML model",
          threat_level: "Low", // ensure color in frontend
        },
      });
      console.log("CUSTOM ML LOGGING: Added benign log to MongoDB");
    } else if (prediction === 1) {
      const logString = Object.entries(mergedLog)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      const output = await getGeminiResponse(logString);
      let verdict = null;
      try {
        verdict = JSON.parse(output);
      } catch {
        verdict = { raw: output };
      }
      await LogModel.create({ log: mergedLog, verdict });
      console.log(
        "CUSTOM ML LOGGING: Added malicious log + Gemini verdict to MongoDB"
      );
    } else {
      await LogModel.create({
        log: mergedLog,
        verdict: {
          threat_type: prediction,
          reason: "Unknown prediction from custom ML model",
        },
      });
      console.log(
        "CUSTOM ML LOGGING: Added log with unknown prediction to MongoDB"
      );
    }
  } catch (err) {
    console.error("CUSTOM ML LOGGING: Failed to process log:", err.message);
  }
}, 7000); // every 10 seconds

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
