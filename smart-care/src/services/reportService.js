const API_URL = "http://localhost:3000/api";

export const getReports = async () => {
  const response = await fetch(`${API_URL}/reports`);
  return response.json();
};