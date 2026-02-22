const API_URL = "http://localhost:3000/api";

export const getPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  return response.json();
};