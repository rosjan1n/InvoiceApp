import * as api from '../api/index';

export const getClients = () => async (dispatch) => {
  try {
    const { data } = await api.fetchClients();

    dispatch({ type: 'CLIENTS_FETCH_ALL', payload: data })
  } catch (error) {
    throw error;
  }
}

export const addClient = (client) => async (dispatch) => {
  try {
    const { data } = await api.createClient(client);

    dispatch({ type: 'CLIENTS_CREATE', payload: data })
  } catch (error) {
    throw error;
  }
}