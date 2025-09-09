import express from "express";   // needs "type": "module" in package.json
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getGeminiResponse(prompt) {
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

app.get("/", (req, res) => {
  res.send({data:"Hello, Express!"});
});

app.post("/gemini-test", async (req,res) => {
  try {
    const { prompt } = req.body;
    const output = await getGeminiResponse(prompt);
    res.json({ response: output });
  } catch(err) {
    console.error(err);
    res.status(500).json({error: "Gemini request failed."});
  }
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
