const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Wprowadź nazwę projektu']
  },
  client_id: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: [true, 'Wprowadź kategorię projektu']
  },
  status: {
    type: Number,
    required: [true, 'Wprowadź status projektu']
  }
});

module.exports = mongoose.model('Project', ProjectSchema);;