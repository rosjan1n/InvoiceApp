import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const calculateBrutto = (product) => {
  return product.quantity * product.price * (1 + product.vat / 100);
};

export const calculateVat = (product) => {
  return (product.price * product.vat * product.quantity) / 100;
};

export const calculateTotal = (data) => {
  let total = 0;
  data.products.map((product) => {
    return (total += calculateBrutto(product));
  });
  data.details.total = total;
  return total;
};

export const calculateDiscount = (data) => {
  var n = parseFloat(calculateTotal(data));
  return n - n * (parseFloat(data.details.discount) / 100);
};

export const invoice_form = {
  details: {
    date_issue: new Date().toJSON(),
    date_sale: new Date().toJSON(),
    payment_method: "",
    status: 0,
    total: 0,
    project_id: "",
    client_id: "",
  },
  client: {
    name: "",
    address: {
      street: "",
      city: "",
      postal_code: "",
    },
    private: {
      phone_number: "",
      bank_account: "",
      nip: "",
    },
  },
  project: {
    name: "",
    category: "",
    client_id: "",
    status: 0,
  },
  products: [
    {
      name: "",
      description: "",
      quantity: 1,
      price: 0,
      vat: 5,
      vat_price: 0,
      total_price_brutto: 0,
      total_price_netto: 0,
    },
  ],
};
