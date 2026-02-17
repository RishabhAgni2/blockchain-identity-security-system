const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  fileHash: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
  checkedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Verification", verificationSchema);