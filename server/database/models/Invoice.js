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
    status: {
        type: Number,
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
        type: String,
        required: [true, 'Wprowadź id projektu']
    },
    client_id: {
        type: String,
        required: [true, 'Wprowadź id klienta']
    }
}, {_id: false});

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
        required: [true, 'Wprowadź numer telefonu']
    },
    bank_account: {
        type: String,
        required: [true, 'Wprowadź numer konta bankowego']
    },
    nip: {
        type: String,
        required: [true, 'Wprowadź NIP']
    }
}, {_id: false});

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Wprowadż nazwę klienta']
    },
    address: AddressSchema,
    private: PrivateSchema
}, {_id: false});

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Wprowadź nazwę projektu']
    },
    category: {
        type: String,
        required: [true, 'Wprowadź kategorię projektu']
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
    client: ClientSchema,
    project: ProjectSchema,
    products: [ProductsSchema],
    editedAt: {
        type: Date,
        default: new Date()
    }
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;