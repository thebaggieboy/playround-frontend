const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()

export const API_BASE_URL = (
  configuredApiUrl ||
  (process.env.NODE_ENV === "production"
    ? "https://playground-backend-1t0f.onrender.com/api"
    : "http://localhost:8000/api")
).replace(/\/+$/, "")