import axiosClient from "./axiosClient";

export async function registerUser({ name, email, password }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);

  const response = await axiosClient.post("/api/register", formData);
  return response.data;
}

export async function loginUser({ email, password }) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const response = await axiosClient.post("/api/login", formData);
  return response.data;
}
