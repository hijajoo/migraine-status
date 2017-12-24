var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DaySchema = new Schema(
  {
    _id: {type: Date, required: true},
    status_on_wakeup: {type: String, enum: ["fine","migraine","motion-migraine","tightness"], required: true},
    severity: {type: Number, max: 10},
    relief_methods: {
      tea: {type: String, enum: ["n/a", "helped", "did not help"]},
      walk: {type: String, enum: ["n/a", "helped", "did not help"]},
      bath: {type: String, enum: ["n/a", "helped", "did not help"]},
      aciloc: {type: String, enum: ["n/a", "helped", "did not help"]},
      food: {type: String, enum: ["n/a", "helped", "did not help"]},
      random: {type: String, enum: ["n/a", "helped", "did not help"]},
      rizora: {type: String, enum: ["n/a", "helped", "did not help"]},
    },
    status_of_triggers: {
      night_meds_on_time: {type: Boolean, required: true},
      ayurvedic_medicine: {type: Boolean, required: true},
      overexertion: {type: Boolean, required: true},
      acidity: {type: Boolean, required: true},
    },
    Notes: {type: String},
  }
);

//Export model
module.exports = mongoose.model('perDayEntry', DaySchema);
