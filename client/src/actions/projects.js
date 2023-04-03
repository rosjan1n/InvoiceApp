import * as api from '../api/index';

export const addProject = (project) => async (dispatch) => {
  try {
    const { data } = await api.createProject(project);
    dispatch({ type: 'PROJECTS_CREATE', payload: data})
  } catch (error) {
    throw error;
  }
}

export const getProjects = () => async (dispatch) => {
  try {
    const { data } = await api.fetchProjects();

    dispatch({ type: 'PROJECTS_FETCH_ALL', payload: data})
  } catch (error) {
    throw error;
  }
}