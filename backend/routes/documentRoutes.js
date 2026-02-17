const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { protect } = require("../middleware/authMiddleware");
const Document = require("../models/Document");
const Verification = require("../models/Verification"); 
const proofContract = require("../blockchain");

const router = express.Router();

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });


// ================= STATS ROUTE (MUST BE ABOVE /:id) =================
router.get("/stats", protect, async (req, res) => {
  try {
    const totalDocs = await Document.countDocuments({
      user: req.user._id,
      active: true,
    });

    const totalVerifications = await Verification.countDocuments({
      user: req.user._id,
    });

    const verified = await Verification.countDocuments({
      user: req.user._id,
      verified: true,
    });

    const tampered = await Verification.countDocuments({
      user: req.user._id,
      verified: false,
    });

    res.json({
      totalDocs,
      totalVerifications,
      verified,
      tampered,
    });
  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


// ================= UPLOAD =================
router.post("/upload", protect, upload.single("document"), async (req, res) => {
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

    // ✅ STEP 4 — Prevent duplicate active documents
    const existingActiveDoc = await Document.findOne({
      user: req.user._id,
      fileHash: hash,
      active: true,
    });

    if (existingActiveDoc) {
      return res.status(400).json({
        message: "Document already exists in your records",
      });
    }

    // ✅ STEP 5 — Smart Blockchain Logic
    const existingProof = await proofContract.getProof(hash);

    if (!existingProof[0]) {
      const tx = await proofContract.storeProof(hash);
      await tx.wait();
    }

    // ✅ Save document in DB
    await Document.create({
      user: req.user._id,
      originalName: req.file.originalname,
      fileHash: hash,
      active: true,
    });

    res.json({ success: true });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ================= GET DOCUMENTS =================
router.get("/", protect, async (req, res) => {
  const docs = await Document.find({
    user: req.user._id,
    active: true,
  });

  res.json({ documents: docs });
});

// ================= DELETE =================
router.delete("/:id", protect, async (req, res) => {
  await Document.updateOne(
    { _id: req.params.id, user: req.user._id },
    { active: false }
  );

  res.json({ success: true });
});

module.exports = router;