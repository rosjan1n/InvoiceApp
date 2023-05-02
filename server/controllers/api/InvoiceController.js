const asyncHandler = require("express-async-handler");

const Invoice = require("../../database/models/Invoice");
const Activity = require("../../database/models/Activity");

const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ user: req.user.id });

  res.status(200).json(invoices);
});

const createInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.create({
    details: req.body.details,
    products: req.body.products,
    editedAt: req.body.editedAt,
    user: req.user.id,
  });

  await invoice.save();

  const activity = await Activity.create({
    user: req.user.id,
    activity_name: "CREATE_INVOICE",
    invoice_id: invoice._id,
    toClient: invoice.details.client_id,
    toProject: invoice.details.project_id,
    timestamp: new Date(),
  });

  await activity.save();

  res.status(200).json(invoice);
});

const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    res.status(400);
    throw new Error("Nieznaleziono faktury");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("Nieznaleziono użytkownika");
  }

  if (invoice.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Brak autoryzacji");
  }

  const updatedInvoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedInvoice);
});

const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({ _id: req.params.id });

  if (!invoice) {
    res.status(400);
    throw new Error("Nie znaleziono faktury");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("Nie znaleziono użytkownika");
  }

  if (invoice.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Brak autoryzacji");
  }

  try {
    await Invoice.deleteOne({ _id: req.params.id });
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500);
    throw new Error("Błąd podczas usuwania faktury");
  }
});

module.exports = {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
