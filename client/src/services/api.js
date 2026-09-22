import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  const token = response.data.token;
  if (token) {
    localStorage.setItem("token", token);
  }
  return response.data;
};

export const login = async (data) => {
  const response = await api.post("/auth/login", data);

  const token = response.data.token;

  if (token) {
    localStorage.setItem("token", token);
  }

  return response.data;
};
export const getOverview = async () => {
  const response = await api.get("/analytics/overview");
  return response.data.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const getTopEvents = async () => {
  const response = await api.get("/analytics/top-events");
  return response.data.data;
};
export const getRecentEvents = async () => {
  const response = await api.get("/analytics/recent-events");
  return response.data.data;
};
export const getEventsByDay = async (days = 7) => {
  const response = await api.get(`/analytics/events-by-day?days=${days}`);
  return response.data.data;
};
export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data.data;
};
export default api;
