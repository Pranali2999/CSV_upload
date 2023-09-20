const Upload = require("../models/upload");

module.exports.home = async (req, res) => {
  try {
    const searchVal = req.query.s;
    const files = await Upload.find();
    res.render("home", {
      title: "CSV Upload",
      files,
      searchVal,
    });
  } catch (err) {
    console.error("Error Finding Files", err);
    res.redirect("/");
  }
};

module.exports.upload = async (req, res) => {
  try {
    console.log("body", req.body);
    console.log("file:", req.file);
    const { filename, originalname, path, size } = req.file;
    const newUpload = {
      filename,
      originalname,
      path,
      size,
    };
    const createdUpload = await Upload.create(newUpload);
    console.log("Upload created:", createdUpload);
    res.redirect("/");
  } catch (error) {
    console.error("Error creating upload:", error);
    res.redirect("/");
  }
};
