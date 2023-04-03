const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema([{
  name: {
    type: String,
    required: true
  },
  client_id: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true
  }
}]);

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;