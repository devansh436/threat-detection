// Usage: node upload-firewall-log.js <csvFilePath>
// Uploads one firewall log every 3 seconds
import mongoose from "mongoose";
import fs from "fs";
import { parse } from "csv-parse/sync";

const MONGO_URI ="mongodb+srv://akshptel4753_db_user:mysYhR3dIsskFVLu@cluster0.yrdvtub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const csvFilePath = process.argv[2];
if (!csvFilePath) {
  console.error("Usage: node upload-firewall-log.js <csvFilePath>");
  process.exit(1);
}

// Only firewall features
const firewallFeatures = [
  "Source Port",
  "Destination Port",
  "Protocol",
  "Flow Duration",
  "Fwd PSH Flags",
  "Bwd PSH Flags",
  "Fwd URG Flags",
  "Bwd URG Flags",
  "Fwd Header Length",
  "Bwd Header Length",
  "Fwd Packets/s",
  "Bwd Packets/s",
  "FIN Flag Count",
  "SYN Flag Count",
  "RST Flag Count",
  "PSH Flag Count",
  "ACK Flag Count",
  "URG Flag Count",
  "CWE Flag Count",
  "ECE Flag Count",
];

const endpointLogSchema = new mongoose.Schema(
  {},
  { strict: false, timestamps: true }
);
const FirewallLogModel = mongoose.model("FirewallLog", endpointLogSchema);

async function uploadLogs() {
  await mongoose.connect(MONGO_URI);
  console.log(`Connected to MongoDB as firewall endpoint`);

  const csvData = fs.readFileSync(csvFilePath, "utf8");
  const logs = parse(csvData, { columns: true, skip_empty_lines: true });

  let i = 0;
  function uploadNext() {
    if (i >= logs.length) {
      console.log(`Uploaded ${logs.length} logs to FirewallLog collection.`);
      mongoose.disconnect();
      return;
    }
    // Only keep firewall features
    const log = {};
    for (const key of firewallFeatures) {
      if (logs[i][key] !== undefined) log[key] = logs[i][key];
    }
    FirewallLogModel.create({ ...log, createdAt: new Date() })
      .then(() => {
        console.log(`Uploaded firewall log ${i + 1}/${logs.length}`);
        i++;
        setTimeout(uploadNext, 3000);
      })
      .catch((err) => {
        console.error(`Error uploading log ${i + 1}:`, err.message);
        i++;
        setTimeout(uploadNext, 3000);
      });
  }
  uploadNext();
}

uploadLogs().catch((err) => {
  console.error("Error uploading logs:", err.message);
  process.exit(1);
});
