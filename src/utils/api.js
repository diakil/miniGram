const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/api/v1/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apiKey': process.env.NEXT_PUBLIC_API_KEY
    },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};