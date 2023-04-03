import * as api from '../api/index';

export const getProjects = () => async (dispatch) => {
  try {
    const { data } = await api.fetchProjects();

    dispatch({ type: 'PROJECTS_FETCH_ALL', payload: data})
  } catch (error) {
    console.log(error.message);
  }
}