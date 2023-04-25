const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  street: {
      type: String,
  },
  city: {
      type: String,
  },
  postal_code: {
      type: String,
  }
}, {_id: false});

const PrivateSchema = new mongoose.Schema({
  phone_number: {
      type: String,
  },
  bank_account: {
      type: String,
  },
  nip: {
      type: String,
  }
}, {_id: false});

const ActivitySchema = new mongoose.Schema({
  activity_name: {
    type: String,
    required: [true, 'Wprowadź nazwę aktywności']
  },
  invoice_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    req: 'Client'
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  toClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  toProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  timestamp: {
    type: Date,
    default: new Date()
  }
}, {_id: false});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Wprowadź nazwę użytkownika"],
  },
  email: {
    type: String,
    required: [true, "Wprowadź email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Wprowadź hasło"],
  },
  address: AddressSchema,
  private: PrivateSchema,
  activities: [ActivitySchema],
  avatar: {
    type: String
  }
});

module.exports = mongoose.model("User", userSchema);
