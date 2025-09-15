// Usage: node upload-webserver-log.js <csvFilePath>
// Uploads one webserver log every 3 seconds
import mongoose from "mongoose";
import fs from "fs";
import { parse } from "csv-parse/sync";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb+srv://akshptel4753_db_user:QIg8pOHpGCKLDRqD@cluster0.dfkxmu2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const csvFilePath = process.argv[2];
if (!csvFilePath) {
  console.error("Usage: node upload-webserver-log.js <csvFilePath>");
  process.exit(1);
}


// Updated webserver features to match CSV columns
const webserverFeatures = [
  "Source IP",
  "Destination IP",
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
  "Idle Min"
];

const endpointLogSchema = new mongoose.Schema(
  {},
  { strict: false, timestamps: true }
);
const WebserverLogModel = mongoose.model("WebserverLog", endpointLogSchema);

async function uploadLogs() {
  await mongoose.connect(MONGO_URI);
  console.log(`Connected to MongoDB as webserver endpoint`);

  const csvData = fs.readFileSync(csvFilePath, "utf8");
  const logs = parse(csvData, { columns: true, skip_empty_lines: true });

  let i = 0;
  function uploadNext() {
    if (i >= logs.length) {
      console.log(`Uploaded ${logs.length} logs to WebserverLog collection.`);
      mongoose.disconnect();
      return;
    }
    // Only keep webserver features
    const log = {};
    for (const key of webserverFeatures) {
      if (logs[i][key] !== undefined) log[key] = logs[i][key];
    }
    WebserverLogModel.create({ ...log, createdAt: new Date() })
      .then(() => {
        console.log(`Uploaded webserver log ${i + 1}/${logs.length}`);
        i++;
        setTimeout(uploadNext, 1000);
      })
      .catch((err) => {
        console.error(`Error uploading log ${i + 1}:`, err.message);
        i++;
        setTimeout(uploadNext, 1000);
      });
  }
  uploadNext();
}

uploadLogs().catch((err) => {
  console.error("Error uploading logs:", err.message);
  process.exit(1);
});
