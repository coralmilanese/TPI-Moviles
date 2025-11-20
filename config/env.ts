export const config = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  MUSEO_LAT: parseFloat(process.env.EXPO_PUBLIC_MUSEO_LAT || "-31.4201"),
  MUSEO_LON: parseFloat(process.env.EXPO_PUBLIC_MUSEO_LON || "-64.1888"),
  MUSEO_RADIUS: parseInt(process.env.EXPO_PUBLIC_MUSEO_RADIUS || "100", 10),
};
