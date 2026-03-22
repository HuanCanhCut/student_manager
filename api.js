const API_BASE = "http://localhost:8000/api";

/**
 * Helper fetch tự động đính kèm Bearer token vào mọi request.
 * @param {string} endpoint - Đường dẫn API, vd: '/auth/login'
 * @param {RequestInit} options - Tùy chọn fetch (method, body, headers, ...)
 * @returns {Promise<any>} Response data (parsed JSON) hoặc null nếu 204
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.message || `Request failed with status ${response.status}`,
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  // 204 No Content
  if (response.status === 204) return null;

  return response.json();
}
