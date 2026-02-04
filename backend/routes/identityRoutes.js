const express = require("express");
const router = express.Router();
const identityContract = require("../blockchain");
const CryptoJS = require("crypto-js");

// helper function (local, minimal)
const hashData = (data) => {
  return CryptoJS.SHA256(data).toString();
};

// CREATE identity (UPDATED WITH HASHING)
router.post("/", async (req, res) => {
  try {
    const { name, dob, document } = req.body;

    // validation (minimal)
    if (!name || !dob || !document) {
      return res.status(400).json({ error: "All fields required" });
    }

    // hashing happens HERE
    const nameHash = hashData(name);
    const dobHash = hashData(dob);
    const documentHash = hashData(document);

    // blockchain call unchanged
    const tx = await identityContract.createIdentity(
      nameHash,
      dobHash,
      documentHash
    );

    await tx.wait();

    res.json({ message: "Identity securely stored" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET identity (NO CHANGE)
router.get("/:address", async (req, res) => {
  try {
    const data = await identityContract.getIdentity(req.params.address);

    res.json({
      nameHash: data[0],
      dobHash: data[1],
      documentHash: data[2],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
