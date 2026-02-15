import axios from "axios";

const api = axios.create({
  baseURL: "https://rag-backend-1-akb5.onrender.com",
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
