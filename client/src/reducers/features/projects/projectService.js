import axios from "axios";

const API_URL = "http://localhost:5001/api/projects";

const createProject = async (projectData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(API_URL, projectData, config);

  return res.data;
};

const getProjects = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(API_URL, config);
  
  return res.data;
};

const projectService = {
  createProject,
  getProjects
};

export default projectService;
