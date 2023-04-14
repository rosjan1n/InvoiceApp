const asyncHandler = require('express-async-handler');

const Invoice = require('../../database/models/Invoice');
const User = require('../../database/models/User');

const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ user: req.user.id });

  res.status(200).json(invoices);
})

const createInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.create({
    details: req.body.details,
    client: req.body.client,
    project: req.body.project,
    products: req.body.products,
    editedAt: req.body.editedAt,
    user: req.user.id
  });

  res.status(200).json(invoice);
})

const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)

  if (!invoice) {
    res.status(400)
    throw new Error('Nieznaleziono faktury')
  }

  if (!req.user) {
    res.status(401)
    throw new Error('Nieznaleziono użytkownika')
  }

  if (invoice.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedInvoice)
})

const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)

  if (!invoice) {
    res.status(400)
    throw new Error('Nieznaleziono faktury')
  }

  if (!req.user) {
    res.status(401)
    throw new Error('Nieznaleziono użytkownika')
  }
  if (invoice.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await invoice.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice
}