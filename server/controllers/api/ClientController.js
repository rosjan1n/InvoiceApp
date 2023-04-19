const asyncHandler = require('express-async-handler');

const Client = require('../../database/models/Client');
const User = require('../../database/models/User');

const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({ user: req.user.id });

  res.status(200).json(clients);
})

const createClient = asyncHandler(async (req, res) => {
  if(!req.body.name || !req.body.address.street || !req.body.address.city || !req.body.address.postal_code || !req.body.private.phone_number || !req.body.private.bank_account || !req.body.private.nip) {
    res.status(400);
    throw new Error('Uzupełnij wszystkie pola')
  }

  const client = await Client.create({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    private: req.body.private,
    user: req.user.id
  })

  res.status(200).json(client);
})

module.exports = {
  getClients,
  createClient
}