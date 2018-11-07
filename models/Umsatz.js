const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");

const UmsatzSchema = new mongoose.Schema({
  datum: {
    type: Date
  },
  safebag: {
    type: String
  },
  aufladerabatt: {
    type: Number
  },
  baraufladung: {
    type: Number
  },
  kdkartenzahlung: {
    type: Number
  },
  bonvito: {
    type: Number
  },
  anzahlkunden: {
    type: Number
  },
  gesamtumsmwst: {
    type: Number
  },
  ums0: {
    type: Number
  },
  ums7: {
    type: Number
  },
  ums19: {
    type: Number
  }
});

UmsatzSchema.plugin(timestamp);
const Umsatz = mongoose.model("Umsatz", UmsatzSchema);
module.exports = Umsatz;
