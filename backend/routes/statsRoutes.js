const Verification = require("../models/Verification");

router.get("/stats", protect, async (req, res) => {
  try {
    const totalDocs = await Document.countDocuments({
      user: req.user._id,
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