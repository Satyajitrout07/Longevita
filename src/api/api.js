
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

export async function apiRequest(endpoint, options = {}) {
  const token = sessionStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(result.message)
      ? result.message.join(", ")
      : result.message || "Request failed";

    throw new Error(message);
  }

  return result;
}
