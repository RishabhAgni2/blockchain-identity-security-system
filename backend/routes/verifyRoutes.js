const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const proofContract = require("../blockchain");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Generate SHA-256 hash
    const fileBuffer = fs.readFileSync(req.file.path);

    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    fs.unlinkSync(req.file.path);

    // 🔥 CORRECT FUNCTION CALL
    const result = await proofContract.getProof(hash);

    const exists = result[0];
    const uploader = result[1];
    const timestamp = result[2];

    if (!exists) {
      return res.json({
        verified: false,
        message: "No proof found on blockchain",
      });
    }

    res.json({
      verified: true,
      uploader,
      timestamp: Number(timestamp),
      hash,
    });

  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});

module.exports = router;