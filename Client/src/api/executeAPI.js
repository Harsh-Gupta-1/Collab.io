import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;
export const executeCode = async (code) => {
  const res = await axios.post(backendURL, { code });
  return res.data;
};
