import axios from "axios";

// const API_BASE = "http://localhost:5000/api/rooms"; // Use .env for production
const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api/rooms";
export const createRoom = async (name) => {
  const res = await axios.post(API_BASE, { name });
  return res.data;
};

export const getRoom = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
};

export const saveRoom = async (id, data) => {
  const res = await axios.put(`${API_BASE}/${id}`, data);
  return res.data;
};
