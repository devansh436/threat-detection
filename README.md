<!-- PROJECT TITLE -->
<h1 align="center">🔥 AI-Driven Threat Detection & Prioritization</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Cybersecurity-AI--Driven-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python">
  <img src="https://img.shields.io/badge/MongoDB-NoSQL-green?style=for-the-badge&logo=mongodb">
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Map%20Visualization-pink?style=for-the-badge&logo=react">
</p>

<p align="center">
🚨 <b>Alert Fatigue is Real</b> – SOC teams face thousands of alerts every day, and missing one critical threat can cost millions.<br>
This project solves that by using <b>AI-driven threat detection, prioritization, and visualization in real-time.</b>
</p>

---

## 📖 Table of Contents

- 🚩 [Problem Statement](#-problem-statement)
- ✨ [Features](#-features)
- 🧠 [System Architecture](#-system-architecture)
- 📊 [Screenshots & Visualizations](#-screenshots--visualizations)
- 🛠 [Tech Stack](#-tech-stack)
- ⚡ [Installation & Setup](#-installation--setup)
- 🖥 [Usage](#-usage)
- 📈 [Example Output](#-example-output)
- 🚀 [Future Enhancements](#-future-enhancements)
- 🤝 [Contributing](#-contributing)
- 📚 [References](#-references)

---

<h1 align="center">🚩 Problem Statement</h1>

Security teams face alert fatigue due to thousands of daily alerts.  
This leads to missed critical threats and delayed incident response.

Our project aims to:  
✅ *Detect* threats in real-time using AI/ML  
✅ *Prioritize* threats with risk scoring  
✅ *Visualize* attacks on a global map  
✅ *Explain* why each alert was classified as a threat  

---

## ✨ Features
- 🔍 *AI-Driven Anomaly Detection* – Trained on CICIDS 2017 dataset  
- 📊 *Statistical IP Analysis* – Track frequency of malicious IPs, destination ports, etc.  
- 🌍 *Global Attack Visualization* – Map attacker IPs on a world map with red markers  
- 🏷 *Threat Prioritization & Explanation* – Risk score, type and reason 
- 🛢 *MongoDB Backend* – Stores predictions in structured JSON format  
- 🖥 *Interactive Dashboard* – Clean UI to view, filter, and analyze threats  

---

## 🧠 System Architecture

```mermaid
graph TD
A[Dataset - CICIDS 2017] -->|Data Cleaning & Merging| B[Preprocessing Pipeline]
B --> C[Primary ML Model - Anomaly Detection]
C -->|Normal Traffic| D1[Store in MongoDB]
C -->|Malicious Traffic| C2[Secondary ML Model - Attack Type Classification]
C2 --> D2[Store Detailed Results in MongoDB]
D1 --> E[Backend API]
D2 --> E[Backend API]
E --> F[Frontend Dashboard]
F -->|Visualization| G[Global Attack Map + Risk Scores]




```
<h2>📊 Screenshots & Visualizations</h2>
Below are some key screenshots of our ML model training and prediction workflow:<Br><br>

🧠 Model Training – Trained on the CICIDS 2017 dataset to classify network traffic as Normal or Malicious.<br>

🔎 Primary Prediction – First model classifies incoming logs in real time.<br>

🤖 Secondary Analysis (Gemini Model) – If malicious, a secondary ML model classifies the exact attack type (e.g., DDoS, PortScan).<Br>

🛢 Data Storage – Predictions (both normal & malicious) are pushed into MongoDB for dashboard visualization.<br>

🌍 Visualization – Dashboard maps attackers, shows risk scores, and allows filtering for SOC analysis.<br><br>

<img width="1772" height="163" alt="Screenshot 2025-09-12 212113" src="[https://github.com/user-attachments/assets/6c90f811-33fd-46bc-91c3-3d6565df76c](https://github-production-user-asset-6210df.s3.amazonaws.com/212310912/488925890-6c90f811-33fd-46bc-91c3-3d6565df76cb.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250912%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250912T192832Z&X-Amz-Expires=300&X-Amz-Signature=db5eaffaf64cf897f67f7a4a8b4918143bc7e8a865cdec60936fadf34e58e582&X-Amz-SignedHeaders=host)" />

<img width="1781" height="590" alt="Screenshot 2025-09-12 212142" src="[https://github.com/user-attachments/assets/5f487e32-b76b-40cf-a04a-f9debdf3ac54](https://github-production-user-asset-6210df.s3.amazonaws.com/212310912/488927068-5f487e32-b76b-40cf-a04a-f9debdf3ac54.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250912%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250912T192857Z&X-Amz-Expires=300&X-Amz-Signature=d661b5e39fb6bcbb7c2fd0874e33a0503e2fe9dae85dddc03d74f59b19d112ff&X-Amz-SignedHeaders=host)" />

<img width="1780" height="234" alt="Screenshot 2025-09-12 212155" src="[https://github.com/user-attachments/assets/d1757e60-24a7-4425-a4bb-c3cd48ebbfa3](https://github-production-user-asset-6210df.s3.amazonaws.com/212310912/488927169-d1757e60-24a7-4425-a4bb-c3cd48ebbfa3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250912%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250912T192910Z&X-Amz-Expires=300&X-Amz-Signature=45986a76b5f749147f3c9480a5f4900839e88b7ec46bd7994380cfd58e76468c&X-Amz-SignedHeaders=host)" />

<img width="1791" height="669" alt="Screenshot 2025-09-12 212221" src="[https://github.com/user-attachments/assets/d03ebccf-98c6-4036-83ed-741acb724dac](https://github-production-user-asset-6210df.s3.amazonaws.com/212310912/488927247-d03ebccf-98c6-4036-83ed-741acb724dac.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250912%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250912T192919Z&X-Amz-Expires=300&X-Amz-Signature=39e01fe1477233571bc90e81c18e9fa90df3b76eda95c72fdd40ba8390d16a48&X-Amz-SignedHeaders=host)" />

<img width="1789" height="659" alt="Screenshot 2025-09-12 212247" src="[https://github.com/user-attachments/assets/3c53d5bb-b7c9-4a2e-82b6-adc7a031a7b3](https://github-production-user-asset-6210df.s3.amazonaws.com/212310912/488927322-3c53d5bb-b7c9-4a2e-82b6-adc7a031a7b3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250912%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250912T192932Z&X-Amz-Expires=300&X-Amz-Signature=b1506117151551ce89d956f26215709e124b136710ef96f328ea70e64d08668d&X-Amz-SignedHeaders=host)" />

<img width="1781" height="177" alt="Screenshot 2025-09-12 212320" src="[https://github.com/user-attachments/assets/cdffbbe3-9c74-484c-9f09-b4708eb930ac](https://github-production-user-asset-6210df.s3.amazonaws.com/212310912/488927445-cdffbbe3-9c74-484c-9f09-b4708eb930ac.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250912%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250912T192945Z&X-Amz-Expires=300&X-Amz-Signature=dc1b07fc8ddf8574c67ee1ad62e2bcb76db8a7f6e2dabab85396f0c65850c2a5&X-Amz-SignedHeaders=host)" />

<img width="1783" height="760" alt="Screenshot 2025-09-12 212340" src="[https://github.com/user-attachments/assets/c09a316d-6105-4f7c-a433-48bdb52f4395](https://github-production-user-asset-6210df.s3.amazonaws.com/212310912/488927529-c09a316d-6105-4f7c-a433-48bdb52f4395.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250912%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250912T193209Z&X-Amz-Expires=300&X-Amz-Signature=5b4a9a65f7ecc09ba66090804359e96ec4fcf2b49d692e078c9b34b3b9469496&X-Amz-SignedHeaders=host)" />

<img width="1806" height="291" alt="Screenshot 2025-09-12 212425" src="[https://github.com/user-attachments/assets/dee82d8c-6666-496d-989c-1a1bfe6e0ffa](https://github-production-user-asset-6210df.s3.amazonaws.com/212310912/488927627-dee82d8c-6666-496d-989c-1a1bfe6e0ffa.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250912%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250912T193343Z&X-Amz-Expires=300&X-Amz-Signature=e2ad34b3d2d4aac1a63b5340d1fe18c7a2567dfd08056812776dffd58650ad24&X-Amz-SignedHeaders=host)" />

<img width="1790" height="514" alt="Screenshot 2025-09-12 212500" src="[https://github.com/user-attachments/assets/e89a478a-2798-42af-b8b0-1e559f0557e7](https://github-production-user-asset-6210df.s3.amazonaws.com/212310912/488928331-e89a478a-2798-42af-b8b0-1e559f0557e7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250912%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250912T193354Z&X-Amz-Expires=300&X-Amz-Signature=9ac7a339dd3b40e065c4e5d749c2c640c9555e26ca136f50a42d4a626bb9b23e&X-Amz-SignedHeaders=host)" />

<img width="1815" height="781" alt="Screenshot 2025-09-12 212533" src="[https://github.com/user-attachments/assets/cb3316f4-d429-44d4-a868-adc7d5c68602](https://github-production-user-asset-6210df.s3.amazonaws.com/212310912/488928416-e3cc52cd-f2b6-4c49-84dc-4e68b8385536.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250912%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250912T193431Z&X-Amz-Expires=300&X-Amz-Signature=18e13f1508e22dbbfa04377aca22185564aad045dca1d2278695239dcaf8bd9e&X-Amz-SignedHeaders=host)" />

<img width="1810" height="699" alt="Screenshot 2025-09-12 212558" src="[https://github.com/user-attachments/assets/e3cc52cd-f2b6-4c49-84dc-4e68b8385536](https://github-production-user-asset-6210df.s3.amazonaws.com/212310912/488928526-7d87be26-9522-4c95-b46a-f97a72537514.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250912%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250912T193440Z&X-Amz-Expires=300&X-Amz-Signature=3ca7480d034479d6bb375963d5b439e0fb889c90c0eea0dbb41c389507d31b1a&X-Amz-SignedHeaders=host)" />

<img width="1805" height="262" alt="Screenshot 2025-09-12 212609" src="[https://github.com/user-attachments/assets/7d87be26-9522-4c95-b46a-f97a72537514](https://github-production-user-asset-6210df.s3.amazonaws.com/212310912/488928526-7d87be26-9522-4c95-b46a-f97a72537514.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250912%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250912T193454Z&X-Amz-Expires=300&X-Amz-Signature=2f806664917125ea4f71fb8b09ad5cd76a89e6ff304e36d61c7fe47995fecc81&X-Amz-SignedHeaders=host)" />

<h2>🛠 Tech Stack</h2>

Frontend: React.js, Chart.js

Backend: Node.js (Express)

Database: MongoDB

Machine Learning: Scikit-learn, Pandas, NumPy,

Dataset: CICIDS 2017 (Combined & Preprocessed)


<h2>⚡ Installation & Setup</h2>

# 1️⃣ Clone the repo
git clone https://github.com/devansh436/threat-detection.git<Br>
cd threat-detection

# 2️⃣ Install backend dependencies
cd server<br>
npm install

# 3️⃣ Start the backend server
npm run dev

# 4️⃣ Start the frontend (if React)
cd client<br>
npm install<br>
npm run dev



<h2>🖥 Usage</h2>
Upload network logs or use sample data<br>
Model will process logs & generate predictions<br>
Visit dashboard → See threats, risk scores & map visualization<br>
Filter results by IP, threat type, or risk level


<h2>📈 Example Output</h2>

{<br>
  "source_ip": "192.168.15.22",<br>
  "dest_ip": "192.168.10.1",<br>
  "protocol": "udp",<br>
  "threat_score": 15,<br>
  "threat_level": "Low",<br>
  "reason": "The log shows a single DNS query (UDP port 53) from a local IP to another local IP. This is generally normal network activity.",<br>
  "threat_type": "normal_traffic"<br>
}


<h2>🚀 Future Enhancements</h2>

📈 More explainable AI with SHAP/LIME<br>
🧠 Deep Learning models for advanced detection


<h2>🤝 Contributing</h2>

We welcome contributions!
Feel free to fork this repo, make changes, and submit a pull request.
For major changes, open an issue first to discuss what you would like to change.


<h2>👨‍💻 Team Members</h2>

Ketan Dav (Team Lead)<br>
Devansh Deshpande<br>
Dharm Patel<br>
Aksh Patel<br>
Devarsh Dalwadi


<h2>📚 References</h2>

- [CICIDS 2017 Dataset](https://www.unb.ca/cic/datasets/ids-2017.html)  
- [Scikit-learn Documentation](https://scikit-learn.org/stable)  
- [MongoDB Docs](https://www.mongodb.com/docs/)
