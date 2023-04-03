const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: {
      type: String,
      required: true
  },
  city: {
      type: String,
      required: true
  },
  postal_code: {
      type: String,
      required: true
  }
}, {_id: false});

const PrivateSchema = new mongoose.Schema({
  phone_number: {
      type: String,
      required: true
  },
  bank_account: {
      type: String,
      required: true
  },
  nip: {
      type: String,
      required: true
  }
}, {_id: false});

const ClientSchema = new mongoose.Schema([{
  name: {
    type: String,
    required: true
  },
  address: AddressSchema,
  private: PrivateSchema,
  project_id: {
    type: String,
    required: false
  },
}]);

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;