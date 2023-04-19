const mongoose = require('mongoose');

const DetailsSchema = new mongoose.Schema({
    date_issue: {
        type: Date,
        default: new Date(),
        required: [true, 'Wprowadź datę wystawienia']
    },
    date_sale: {
        type: Date,
        default: new Date(),
        required: [true, 'Wprowadź datę sprzedaży']
    },
    payment_method: {
        type: String,
        required: [true, 'Wprowadź metodę płatności']
    },
    paid: {
        type: Boolean,
        required: [true, 'Wprowadź status faktury']
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: [true, 'Wprowadź łączną kwote']
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Wprowadź id projektu'],
        ref: 'Project'
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Wprowadź id klienta'],
        ref: 'Client'
    }
}, {_id: false});

const ProductsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Wprowadź nazwę produktu']
    },
    price: {
        type: Number,
        required: [true, 'Wprowadź cenę jednostkową produktu']
    },
    quantity: {
        type: Number,
        required: [true, 'Wprowadź ilość produktów']
    },
    vat: {
        type: Number,
        required: [true, 'Wprowadź VAT']
    },
    price_vat: {
        type: Number,
        required: [true, 'Wprowadź kwotę VAT']
    },
    total_price_brutto: {
        type: Number,
        required: [true, 'Wprowadź łączną kwotę brutto']
    },
    total_price_netto: {
        type: Number,
        required: [true, 'Wprowadź łączną kwotę netto']
    }
}, {_id: false});

const InvoiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    details: DetailsSchema,
    products: [ProductsSchema],
    editedAt: {
        type: Date,
        default: new Date()
    }
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;