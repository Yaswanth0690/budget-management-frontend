const BASE_URL = "http://localhost:8080/api";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  // 🔥 Handle 204 immediately
  if (response.status === 204) {
    return null;
  }

  // 🔥 If not OK, extract error
  if (!response.ok) {
    let errorMessage = "Something went wrong";

    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {}

    throw new Error(errorMessage);
  }

  // 🔥 Safe JSON parsing (handles empty body)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}