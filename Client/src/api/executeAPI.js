import axios from "axios";

export const executeCode = async (code) => {
  const res = await axios.post("http://localhost:5000/api/execute", { code });
  return res.data;
};
