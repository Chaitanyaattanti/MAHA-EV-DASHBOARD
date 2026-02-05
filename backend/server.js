const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();
require('dotenv').config();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Serve static files from datasets folder
app.use('/files', express.static(path.join(__dirname, 'datasets')));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK",
    timestamp: new Date().toISOString(),
    database: db.isConnected ? db.isConnected() : "unknown"
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "VidyutAI Backend API Server",
    status: "Running",
    endpoints: {
      health: "GET /health - Service health check",
      datasets: "GET /datasets - Get all dataset metadata",
      download: "GET /download/:filename - Download dataset file"
    }
  });
});

app.get("/datasets", (req, res) => {
  const sql = `
    SELECT dataset_name, dataset_description, dataset_source, dataset_url
    FROM datasets
    ORDER BY added_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ Database Query Error in /datasets:", err);
      // Hardcode fallback data so the user ALWAYS sees something even if DB fails
      const fallbackData = [
        {
          dataset_name: "LG 18650HG2 Li-ion Battery Data",
          dataset_description: "High-precision lithium-ion battery testing data from McMaster University (Fallback Data)",
          dataset_source: "Kollmeyer et al. (2020) - Fallback Mode",
          dataset_url: "dataset1.zip"
        },
        {
          dataset_name: "Mechanically Induced Thermal Runaway",
          dataset_description: "Safety testing data examining thermal runaway behavior (Fallback Data)",
          dataset_source: "Lin et al. (2024) - Fallback Mode",
          dataset_url: "dataset2.zip"
        },
        {
           dataset_name: "CALCE Battery Data",
           dataset_description: "Battery testing datasets and related resources from CALCE (Fallback Data)",
           dataset_source: "CALCE, University of Maryland",
           dataset_url: "https://calce.umd.edu/battery-data"
        }
      ];
      console.log("⚠️ Serving fallback data due to DB error");
      res.json(fallbackData); 
    } else {
      res.json(result);
    }
  });
});

// Download endpoint for local files
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'datasets', filename);
  
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(404).json({ error: "File not found" });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
