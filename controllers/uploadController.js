const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const Upload = require("../models/upload");

module.exports.view = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const searchQuery = req.query.q; // Get the search query from the URL query parameters

    const file = await Upload.findById(fileId);

    if (!file) {
      return res.status(404).send("File not found");
    }

    const filePath = path.join(__dirname, "../uploads", file.filename);

    // Check if the file exists before attempting to read it
    const fileExists = fs.existsSync(filePath);

    if (!fileExists) {
      console.error(`File not found at path: ${filePath}`);
      return res.status(404).send("File not found");
    }

    const results = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => {
          results.push(data);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (results.length === 0) {
      return res.status(404).send("No data found in the CSV file");
    }

    const tableHeaders = Object.keys(results[0]);
    let tableRows = results;

    if (searchQuery) {
      // Filter the tableRows based on the search query
      tableRows = tableRows.filter((row) =>
        Object.values(row).some((value) =>
          value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    res.render("csv", {
      title: "CSV Viewer",
      file,
      tableHeaders,
      tableRows,
      searchQuery,
    });
  } catch (error) {
    console.error("File retrieval error:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.delete = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const file = await Upload.findById(fileId);

    if (!file) {
      return res.status(404).send("File not found");
    }

    const filePath = path.join(__dirname, "../uploads", file.filename);

    // Check if the file exists before attempting to delete it
    const fileExists = fs.existsSync(filePath);

    if (!fileExists) {
      console.error(`File not found at path: ${filePath}`);
      return res.status(404).send("File not found");
    }

    // Remove the file from the file system
    fs.unlinkSync(filePath);

    // Remove the file from the database
    await Upload.findByIdAndDelete(fileId);

    res.redirect("/");
  } catch (error) {
    console.error("File deletion error:", error);
    res.status(500).send("Internal Server Error");
  }
};
