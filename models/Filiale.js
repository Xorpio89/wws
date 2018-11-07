const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const FilialeSchema = new mongoose.Schema({
  name: {
    type: String
  }
});

FilialeSchema.plugin(timestamp);
const Filiale = mongoose.model("Filiale", FilialeSchema);
module.exports = Filiale;
