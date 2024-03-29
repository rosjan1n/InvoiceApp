import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const calculateBrutto = (product) => {
  return parseFloat(parseInt(product.quantity) * parseInt(product.price) * (1 + parseInt(product.vat) / 100));
};

export const calculateVat = (product) => {
  return (product.price * product.vat * product.quantity) / 100;
};

export const calculateTotal = (data) => {
  const total = data.products.reduce((acc, product) => acc + calculateBrutto(product), 0);

  return { ...data.details.total, total };
};

export const calculateDiscount = (data) => {
  var n = parseFloat(calculateTotal(data).total);
  return n - n * (parseFloat(data.details.discount) / 100);
};

export const invoice_form = {
  details: {
    date_issue: new Date().toJSON(),
    date_sale: new Date().toJSON(),
    payment_method: "",
    paid: false,
    total: 0,
    project_id: "",
    client_id: "",
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
