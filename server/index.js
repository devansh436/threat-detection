import express from "express"; // needs "type": "module" in package.json
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { dirname } from "path";
import { fileURLToPath } from "url";
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
  3. Explain briefly why you assigned this score.

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

  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

app.get("/", (req, res) => {
  res.send({ data: "Hello, Express!" });
});

// TODO: get req to retrieve logs

import fs from "fs";
import path from "path";

app.get("/get-log", async (req, res) => {
  const logFile = path.join(__dirname, "logs", "demo_log.csv");
  try {
    const data = fs.readFileSync(logFile, "utf8");
    const lines = data.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0)
      return res
        .status(404)
        .json({ response: null, log: null, error: "No logs found" });
    // Pick a random log (skip header if present)
    const hasHeader = lines[0].includes(",");
    const logLines = hasHeader ? lines.slice(1) : lines;
    const randomLog = logLines[Math.floor(Math.random() * logLines.length)];
    // Send to Gemini
    try {
      const output = await getGeminiResponse(randomLog);
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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
