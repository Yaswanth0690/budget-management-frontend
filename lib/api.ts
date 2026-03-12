// 🔥 Pulls the URL from Environment Variables, falling back to your local Docker container
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://140.245.250.4:8080";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  // Retrieve token safely on the client side
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // Ensure seamless URL construction without double-slashes
  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const response = await fetch(`${BASE_URL}${formattedEndpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  // 🔥 Handle 204 No Content immediately
  if (response.status === 204) {
    return null;
  }

  // 🔥 If not OK, extract error
  if (!response.ok) {
    let errorMessage = "Something went wrong";

    try {
      // First try to parse as JSON (e.g., standard Spring Boot error responses)
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Fallback: If Spring Boot returns a plain text error instead of JSON
      try {
        const errorText = await response.text();
        if (errorText) errorMessage = errorText;
      } catch {}
    }

    throw new Error(errorMessage);
  }

  // 🔥 Safe JSON parsing (handles empty response bodies)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}