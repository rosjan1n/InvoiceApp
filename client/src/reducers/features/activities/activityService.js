import axios from "axios";

const API_URL = "http://localhost:5001/api/activities";

const getActivities = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(API_URL, config);

  return res.data;
};

const activityService = {
  getActivities,
};

export default activityService;
