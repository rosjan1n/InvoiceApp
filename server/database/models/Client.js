const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: {
      type: String,
      required: [true, 'Wprowadź ulicę']
  },
  city: {
      type: String,
      required: [true, 'Wprowadź miasto']
  },
  postal_code: {
      type: String,
      required: [true, 'Wprowadź kod pocztowy']
  }
}, {_id: false});

const PrivateSchema = new mongoose.Schema({
  phone_number: {
      type: String,
      required: [true, 'Wprowadź numer telefonu klienta']
  },
  bank_account: {
      type: String,
      required: [true, 'Wprowadź numer konta bankowego klienta']
  },
  nip: {
      type: String,
      required: [true, 'Wprowadź NIP']
  }
}, {_id: false});

const ClientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Wprowadź nazwę klienta']
  },
  address: AddressSchema,
  private: PrivateSchema,
  project_id: {
    type: String,
    required: false
  },
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;