const connectToMongo = require("./db"); // initializing db file
const express = require("express"); // Initializing
require("dotenv").config();
const authenticateAdmin = require("./middleware/fetcher");
const formidable = require("formidable");
const fsPromises = require("fs").promises;
const path = require("path");

connectToMongo(); //! Running db server

const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use("/uploads", express.static("uploads"));

app.use(cors());
app.use(express.json({ limit: "100mb" }));

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/trips", require("./routes/trips"));

// To Upload Files
app.post("/api/upload", (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error uploading images" });
    }

    try {
      const filesArray = files.files;
      const imagePaths = [];

      if (filesArray) {
        for (const file of filesArray) {
          const oldPath = file.filepath;
          const fileName = `${Date.now()}_${file.originalFilename}`;
          const newPath = path.join(__dirname, "uploads", fileName);

          await fsPromises.rename(oldPath, newPath);

          const imagePath = `/uploads/${fileName}`;
          imagePaths.push(imagePath);
        }
      }

      return res.status(200).json({ imagePaths });
    } catch (error) {
      console.error("Error moving files:", error);
      return res.status(500).json({ error: "Error moving files" });
    }
  });
});

app.post("/api/upload/itinerary", (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error uploading itinerary" });
    }

    try {
      const file = files.pdfFile[0];

      const oldPath = file.filepath;
      const fileName = `${Date.now()}_${file.originalFilename}`;
      const newPath = path.join(__dirname, "uploads", fileName);

      await fsPromises.rename(oldPath, newPath);

      const itineraryPath = `/uploads/${fileName}`;

      return res.status(200).json({ itineraryPath });
    } catch (error) {
      console.error("Error moving file:", error);
      console.log("Error moving file:", error);
      return res.status(500).json({ error: error });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
