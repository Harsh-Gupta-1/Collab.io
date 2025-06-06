import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api";

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const createRoom = async (name) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    setAuthToken(token);
    const res = await axios.post(`${API_BASE}/rooms`, { name });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to create room");
  }
};

export const getRoom = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    setAuthToken(token);
    const res = await axios.get(`${API_BASE}/rooms/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch room");
  }
};

export const saveRoom = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    setAuthToken(token);
    const res = await axios.put(`${API_BASE}/rooms/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to save room");
  }
};

export const getUserRooms = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    setAuthToken(token);
    const res = await axios.get(`${API_BASE}/dashboard/rooms`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch user rooms");
  }
};