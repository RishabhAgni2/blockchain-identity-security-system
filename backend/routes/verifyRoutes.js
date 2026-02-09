const express = require("express");
const router = express.Router();

// Blockchain contract
const proofContract = require("../blockchain");

/**
 * @route   GET /api/verify/:hash
 * @desc    Verify document hash on blockchain
 * @access  Public
 */
router.get("/:hash", async (req, res) => {
  try {
    const { hash } = req.params;

    if (!hash) {
      return res.status(400).json({ message: "Hash is required" });
    }

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
      timestamp,
      verifiedAt: new Date(timestamp * 1000),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Verification failed" });
  }
});

module.exports = router;
