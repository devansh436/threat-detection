import express from "express"; // needs "type": "module" in package.json
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

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
app.get("/gemini-test", async (req, res) => {
  try {
    // TODO:
    // random log from csv selection logic
    // const { inputLog } = ...;
    const output = await getGeminiResponse(inputLog);
    res.json({ response: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini request failed." });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
