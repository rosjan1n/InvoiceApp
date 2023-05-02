const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/api/UserController.js");
const activityController = require("../controllers/api/ActivityController.js");
const invoiceController = require("../controllers/api/InvoiceController.js");
const clientController = require("../controllers/api/ClientController.js");
const projectController = require("../controllers/api/ProjectController.js");

const { protect } = require("../middleware/authMiddleware.js");

/* Auth API */
router.post("/users/signin", registerUser);
router.post("/users/login", loginUser);

/* Activities API */
router.route("/activities").get(protect, activityController.getActivities);

/* Clients API */
router
  .route("/clients")
  .get(protect, clientController.getClients)
  .post(protect, clientController.createClient);

/* Projects API */
router
  .route("/projects")
  .get(protect, projectController.getProjects)
  .post(protect, projectController.createProject);

/* Invoices API */
router
  .route("/invoices")
  .get(protect, invoiceController.getInvoices)
  .post(protect, invoiceController.createInvoice);
router
  .route("/invoices/:id")
  .put(protect, invoiceController.updateInvoice)
  .delete(protect, invoiceController.deleteInvoice);

module.exports = router;
