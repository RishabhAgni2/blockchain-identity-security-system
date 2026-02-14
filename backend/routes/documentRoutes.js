const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { protect } = require("../middleware/authMiddleware");
const Document = require("../models/Document");
const proofContract = require("../blockchain");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });

// ================= UPLOAD =================
router.post("/upload", protect, upload.single("document"), async (req, res) => {
  try {
    const fileBuffer = fs.readFileSync(req.file.path);

    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    fs.unlinkSync(req.file.path);

    const document = await Document.create({
      user: req.user._id,
      originalName: req.file.originalname,
      fileHash: hash,
    });

    const tx = await proofContract.storeProof(hash);
    await tx.wait();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

// ================= GET DOCUMENTS =================
router.get("/", protect, async (req, res) => {
  const docs = await Document.find({ user: req.user._id });
  res.json({ documents: docs });
});

// ================= DELETE =================
router.delete("/:id", protect, async (req, res) => {
  await Document.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ success: true });
});

module.exports = router;