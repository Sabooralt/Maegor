const mongoose = require("mongoose");
const { Schema } = mongoose;

const otcSchema = new Schema({
  email: { type: String, required: true, unique: true },
  otc: { type: String, required: true },
  createdAt: { type: Date, expires: "10m", default: Date.now },
});

const OTC = mongoose.model("OTC", otcSchema);

module.exports = OTC;
