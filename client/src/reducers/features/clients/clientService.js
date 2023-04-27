import axios from "axios";

const API_URL = "http://localhost:5001/api/clients";

const createClient = async (clientData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(API_URL, clientData, config);
  console.log(res.data);
  return res.data;
};

const getClients = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(API_URL, config);
  
  return res.data;
};

const clientService = {
  createClient,
  getClients
};

export default clientService;
