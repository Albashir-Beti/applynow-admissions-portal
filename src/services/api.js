import axios from "axios";

// Create one reusable Axios instance for our mock API
const api = axios.create({
  baseURL: "http://localhost:3001",
});

export default api;