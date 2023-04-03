const Invoice = require('../../database/models/Invoice');

class InvoiceController {
    async saveInvoice(req, res) {
      const data = req.body;
      let invoice;

      try {
        invoice = new Invoice({ 
            details: data.details,
            client: data.client,
            project: data.project,
            products: data.products
        });
        await invoice.save();
      } catch (error) {
        return res.status(422).json({ message: error.message });
      }

      res.status(201).json(invoice);
    }

    async editInvoice(req, res) {
      try {
        const id = req.params.id;
        const data = req.body;
        const invoice = await Invoice.findOne({ _id: id });
        invoice.details = data.details;
        invoice.client = data.client;
        invoice.project = data.project;
        invoice.products = data.products;
        invoice.editedAt = data.editedAt;
        await invoice.save();
        res.status(201).json(invoice);
    } catch (error) {
        return res.status(422).json({ message: error.message });
      }
    }

    async getAllInvoices(req, res) {
      let doc;
      try {
        doc = await Invoice.find({});
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
      
      res.status(200).json(doc);
    }

    async getInvoice(req, res) {
      let doc;
      try {
        const id = req.params.id;
        doc = await Invoice.findOne({ _id: id });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }

      res.status(200).json(doc);
    }

    async deleteInvoice(req, res) {
      try {
        const id = req.params.id;
        await Invoice.deleteOne({ _id: id });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }

      res.status(200).json({ message: "Usunięto" });
    }
}

module.exports = new InvoiceController();