import { jwtDecode } from "jwt-decode";

export const verifyTokenLocally = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return false; // No token available
  }

  try {
    // Decode the token payload (jwt-decode doesn't require a secret)
    const decoded = jwtDecode(token);

    // Manual expiration check if needed
    const currentTime = Date.now() / 1000; // Convert to seconds
    if (decoded.exp < currentTime) {
      return false; // Token is expired
    }

    return decoded ? true : false;
  } catch (error) {
    // If the token is expired or invalid, return false
    return false;
  }
};
