import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    config.headers = config.headers || {};

    if (token) {
      config.headers.set
        ? config.headers.set("Authorization", `Bearer ${token}`)
        : (config.headers.Authorization = `Bearer ${token}`);
    }
    console.log("Axios token attached:", Boolean(localStorage.getItem("token")));
    return config;
  },
  (error) => Promise.reject(error)
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

export const getTopEvents = async (days = 7) => {
  const response = await api.get(`/analytics/top-events?days=${days}`);
  return response.data.data;
};

export const getRecentEvents = async (days = 7) => {
  const response = await api.get(`/analytics/recent-events?days=${days}`);
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
export const createProject = async (data) => {
  const response = await api.post("/projects", data);
  return response.data;
};
export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data.data;
};
export const getApiKeys = async () => {
  const response = await api.get("/api-keys");
  return response.data.data;
};
export const createApiKey = async (data) => {
  const response = await api.post("/api-keys", data);
  return response.data;
};
export const getProjectAnalytics = async (id, days ) => {
  const response = await api.get(`/analytics/project/${id}?days=${days}`);
  return response.data.data;
};
export const getUsage = async () => {
  const response = await api.get("/usage");
  return response.data.data;
};

export const createBillingSubscription = async () => {
  const response = await api.post("/billing/subscription");
  return response.data.data;
};

export const updateApiKey = async (id, data) => {
  const response = await api.patch(`/api-keys/${id}`, data);
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};

export const clearReadNotifications = async () => {
  const response = await api.delete("/notifications/read");
  return response.data;
};


export default api;
