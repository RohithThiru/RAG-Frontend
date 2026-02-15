import axios from "axios";

const api = axios.create({
  baseURL: "http://metro.proxy.rlwy.net:57473",
});

export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/upload", formData);
};

export const getDocuments = () => {
  return api.get("/documents");
};

export const askQuestion = (question) => {
  return api.post("/ask", { question });
};
