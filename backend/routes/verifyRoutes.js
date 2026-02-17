const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const proofContract = require("../blockchain");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", protect, upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileBuffer = fs.readFileSync(req.file.path);

    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    fs.unlinkSync(req.file.path);

    const result = await proofContract.getProof(hash);
    const exists = result[0];

    const Verification = require("../models/Verification");

    await Verification.create({
      user: req.user._id,
      fileHash: hash,
      verified: exists,
    });

    res.json({ verified: exists });

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;