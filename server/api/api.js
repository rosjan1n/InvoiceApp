const express = require('express');
const router = express.Router();

const invoiceController = require('../controllers/api/InvoiceController.js');
const clientController = require('../controllers/api/ClientController.js');
const projectController = require('../controllers/api/ProjectController.js');


/* Clients API */
router.get('/clients', clientController.getAllClients);
router.get('/clients/:id', clientController.getClient);
router.post('/clients', clientController.saveClient);

/* Projects API */
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProject);
router.post('/projects', projectController.saveProject);

/* Invoices API */
router.get('/invoices', invoiceController.getAllInvoices);
router.get('/invoices/:id', invoiceController.getInvoice);
router.put('/invoices/:id', invoiceController.editInvoice);
router.post('/invoices', invoiceController.saveInvoice);
router.delete('/invoices/:id', invoiceController.deleteInvoice);


module.exports = router;