const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Serve JSON files as static files (optional, only if you want to access them directly)
app.use(
  "/chennai-perth",
  express.static(path.join(__dirname, "chennai-perth"))
);

// Endpoint to get the list of JSON files
app.get("/get-json-files", (req, res) => {
  const folderPath = path.join(__dirname, "chennai-perth");
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory");
    }
    // Filter to get only .json files
    const jsonFiles = files.filter((file) => file.endsWith(".json"));
    res.json(jsonFiles); // Send list of JSON files
  });
});

// Endpoint to serve the content of a specific JSON file
app.get("/chennai-perth/:file", (req, res) => {
  const filePath = path.join(__dirname, "chennai-perth", req.params.file);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(404).send("File not found");
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData); // Return the content of the JSON file
    } catch (error) {
      res.status(500).send("Invalid JSON format");
    }
  });
});

// Handle incorrect routes gracefully
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
