import * as api from '../api/index';

export const addInvoice = (invoice) => async (dispatch) => {
  try {
    const { data } = await api.createInvoice(invoice);
    dispatch({ type: 'INVOICES_CREATE', payload: data})
  } catch (error) {
    throw error;
  }
}

export const getInvoices = () => async (dispatch) => {
  try {
    const { data } = await api.fetchInvoices();

    dispatch({ type: 'INVOICES_FETCH_ALL', payload: data})
  } catch (error) {
    throw error;
  }
}

export const editInvoice = (id, invoice) => async (dispatch) => {
  try {
    const { data } = await api.editInvoice(id, invoice);
    dispatch({ type: 'INVOICES_EDIT', payload: data });
  } catch (error) {
    throw error;
  }
}

export const deleteInvoice = (id) => async (dispatch) => {
  try {
    await api.deleteInvoice(id);

    dispatch({ type: 'INVOICES_DELETE', payload: id});
  } catch (error) {
    throw error;
  }
}