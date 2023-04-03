const mongoose = require('mongoose');

const DetailsSchema = new mongoose.Schema({
    date_issue: {
        type: Date,
        default: new Date()
    },
    date_sale: {
        type: Date,
        default: new Date()
    },
    payment_method: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    project_id: {
        type: String,
        required: true
    },
    client_id: {
        type: String,
        required: true
    }
}, {_id: false});

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

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: AddressSchema,
    private: PrivateSchema
}, {_id: false});

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
}, {_id: false});

const ProductsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    vat: {
        type: Number,
        required: true
    },
    price_vat: {
        type: Number,
        required: true
    },
    total_price_brutto: {
        type: Number,
        required: true
    },
    total_price_netto: {
        type: Number,
        required: true
    }
}, {_id: false});

const InvoiceSchema = new mongoose.Schema([{
    details: DetailsSchema,
    client: ClientSchema,
    project: ProjectSchema,
    products: [ProductsSchema],
    editedAt: {
        type: Date,
        default: new Date()
    }
}], {_id: true});

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;