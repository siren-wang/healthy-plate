import axios from "axios";

const api = axios.create({
  baseURL: "https://sq9mg70ri1.execute-api.us-east-2.amazonaws.com/prod",
});

export default api;
