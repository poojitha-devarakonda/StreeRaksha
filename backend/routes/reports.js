import express from "express";
import multer from "multer";
import Report from "../models/Reports.js";

const router = express.Router();


// Multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// CREATE
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const report = new Report({
      title: req.body.title,
      description: req.body.description,
      image: req.file ? req.file.filename : null
    });

    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json(err);
  }
});

// READ ALL
router.get("/", async (req, res) => {
  const reports = await Report.find();
  res.json(reports);
});

// READ ONE
router.get("/:id", async (req, res) => {
  const report = await Report.findById(req.params.id);
  res.json(report);
});

// UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  const updateData = {
    title: req.body.title,
    description: req.body.description
  };

  if (req.file) {
    updateData.image = req.file.filename;
  }

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.json(report);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Report.findByIdAndDelete(req.params.id);
  res.json({ msg: "Report deleted" });
});

export default router;