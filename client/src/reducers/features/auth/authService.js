import axios from "axios";

const API_URL = "http://localhost:5001/api/users";

/* Register user */
const register = async (userData) => {
  await new Promise((reslove) => setTimeout(reslove, 500));

  const res = await axios.post(`${API_URL}/signin`, userData);

  if (res.data) localStorage.setItem("user", JSON.stringify(res.data));

  return res.data;
};

/* Login user */
const login = async (userData) => {
  await new Promise((reslove) => setTimeout(reslove, 500));

  const res = await axios.post(`${API_URL}/login`, userData);

  if (res.data) localStorage.setItem("user", JSON.stringify(res.data));

  return res.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
