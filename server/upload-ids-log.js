// Usage: node upload-ids-log.js <csvFilePath>
// Uploads one IDS log every 3 seconds
import mongoose from "mongoose";
import fs from "fs";
import { parse } from "csv-parse/sync";

const MONGO_URI = "mongodb+srv://akshptel4753_db_user:XKmdcLWtFNKWzunw@cluster0.jp8nq9h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const csvFilePath = process.argv[2];
if (!csvFilePath) {
  console.error("Usage: node upload-ids-log.js <csvFilePath>");
  process.exit(1);
}

// Only IDS features
const idsFeatures = [
  "Source Port",
  "Destination Port",
  "Protocol",
  "Flow Duration",
  "Active Mean",
  "Active Std",
  "Active Max",
  "Active Min",
  "Idle Mean",
  "Idle Std",
  "Idle Max",
  "Idle Min",
  "Init_Win_bytes_forward",
  "Init_Win_bytes_backward",
  "act_data_pkt_fwd",
  "min_seg_size_forward",
];

const endpointLogSchema = new mongoose.Schema(
  {},
  { strict: false, timestamps: true }
);
const IDSLogModel = mongoose.model("IDSLog", endpointLogSchema);

async function uploadLogs() {
  await mongoose.connect(MONGO_URI);
  console.log(`Connected to MongoDB as IDS endpoint`);

  const csvData = fs.readFileSync(csvFilePath, "utf8");
  const logs = parse(csvData, { columns: true, skip_empty_lines: true });

  let i = 0;
  function uploadNext() {
    if (i >= logs.length) {
      console.log(`Uploaded ${logs.length} logs to IDSLog collection.`);
      mongoose.disconnect();
      return;
    }
    // Only keep IDS features
    const log = {};
    for (const key of idsFeatures) {
      if (logs[i][key] !== undefined) log[key] = logs[i][key];
    }
    IDSLogModel.create({ ...log, createdAt: new Date() })
      .then(() => {
        console.log(`Uploaded IDS log ${i + 1}/${logs.length}`);
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
