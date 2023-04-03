import axios from "axios";

const API_URL = 'http://localhost:5001/api';

/* Create data */
export const createInvoice = (data) => axios.post(`${API_URL}/invoices`, data);

/* Fetch data */
export const fetchInvoices = () => axios.get(`${API_URL}/invoices`);
export const fetchClients = () => axios.get(`${API_URL}/clients`);
export const fetchProjects = () => axios.get(`${API_URL}/projects`);

/* Edit data */
export const editInvoice = (id, data) => axios.put(`${API_URL}/invoices/${id}`, data);

/* Delete data */
export const deleteInvoice = (id) => axios.delete(`${API_URL}/invoices/${id}`);