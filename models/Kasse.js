const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const KasseSchema = new mongoose.Schema({
  name: {
    type: String
  }
});

KasseSchema.plugin(timestamp);
const Kasse = mongoose.model("Kasse", KasseSchema);
module.exports = Kasse;
