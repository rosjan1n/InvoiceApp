import * as api from '../api/index';

export const getClients = () => async (dispatch) => {
  try {
    const { data } = await api.fetchClients();

    dispatch({ type: 'CLIENTS_FETCH_ALL', payload: data})
  } catch (error) {
    console.log(error.message);
  }
}