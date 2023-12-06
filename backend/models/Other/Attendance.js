const mongoose = require("mongoose");

const Attendance = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  studentID: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  }, 
  week: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", Attendance);
