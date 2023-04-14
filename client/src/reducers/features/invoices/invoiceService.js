import axios from "axios";

const API_URL = "http://localhost:5001/api/invoices";

const createInvoice = async (invoiceData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(API_URL, invoiceData, config);

  return res.data;
};

const editInvoice = async (invoiceId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.put(`${API_URL}/${invoiceId}`, config);

  return res.data;
};

const getInvoices = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(API_URL, config);

  return res.data;
};

const deleteInvoice = async (invoiceId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.delete(`${API_URL}/${invoiceId}`, config);

  return res.data;
};

const invoiceService = {
  createInvoice,
  editInvoice,
  getInvoices,
  deleteInvoice,
};

export default invoiceService;
