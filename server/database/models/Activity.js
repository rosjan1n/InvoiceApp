const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  activity_name: {
    type: String,
    required: [true, "Wprowadź nazwę aktywności"],
  },
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    req: "Client",
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  toClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  toProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
});

const Activity = mongoose.model("Activity", ActivitySchema);

module.exports = Activity;
