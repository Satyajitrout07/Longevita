
import { apiRequest } from "../api/api";

export const authService = {
  async register(payload) {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
      }),
    });

    sessionStorage.setItem(
      "accessToken",
      response.data.accessToken
    );

    return response.data.user;
  },

  async login(payload) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });

    sessionStorage.setItem(
      "accessToken",
      response.data.accessToken
    );

    return response.data.user;
  },

  async getMe() {
    const response = await apiRequest("/auth/me");
    return response.data;
  },

  logout() {
    sessionStorage.removeItem("accessToken");
  },
};
