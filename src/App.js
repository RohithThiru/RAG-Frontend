import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./App.css";

const api = axios.create({
  baseURL: "http://metro.proxy.rlwy.net:57473",
});

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);

  const [loading, setLoading] = useState({
    upload: false,
    ask: false,
  });

  const [toast, setToast] = useState(null);

  // -------------------------------
  // Toast helper
  // -------------------------------
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // -------------------------------
  // Fetch documents
  // -------------------------------
  const fetchDocuments = useCallback(async () => {
    try {
      const res = await api.get("/documents");
      setDocuments(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Failed to load documents", "error");
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // -------------------------------
  // Upload
  // -------------------------------
  const handleUpload = async () => {
    if (!file) {
      showToast("Please select a file first", "error");
      return;
    }

    setLoading((l) => ({ ...l, upload: true }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/upload", formData);
      showToast("Document uploaded successfully");
      setFile(null);
      fetchDocuments();
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setLoading((l) => ({ ...l, upload: false }));
    }
  };

  // -------------------------------
  // Ask
  // -------------------------------
  const handleAsk = async () => {
    if (!question.trim()) {
      showToast("Please enter a question", "error");
      return;
    }

    setLoading((l) => ({ ...l, ask: true }));
    setAnswer(null);

    try {
      const res = await api.post("/ask", { question });
      setAnswer(res.data);
    } catch {
      showToast("Failed to get answer", "error");
    } finally {
      setLoading((l) => ({ ...l, ask: false }));
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📄 RAG Document Assistant</h1>
        <p>Ask questions strictly from your uploaded documents</p>
      </header>

      <div className="grid">
        {/* Upload */}
        <section className="card">
          <h2>Upload Document</h2>

          <label className="file-input">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file ? file.name : "Choose PDF file"}
          </label>

          <button onClick={handleUpload} disabled={loading.upload}>
            {loading.upload ? "Uploading..." : "Upload"}
          </button>
        </section>

        {/* Documents */}
       <section className="card">
  <h2>Uploaded Documents</h2>

  {documents.length === 0 ? (
    <div className="empty">
      <p>📂 No documents found</p>
      <span>Upload a PDF to get started</span>
    </div>
  ) : (
    <ul className="doc-list">
      {documents.map((doc, i) => (
        <li key={i}>📘 {doc.filename}</li>
      ))}
    </ul>
  )}
</section>
      </div>

      {/* Ask */}
      <section className="card full">
        <h2>Ask a Question</h2>

        <textarea
          placeholder="Ask something from the documents..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button onClick={handleAsk} disabled={loading.ask}>
          {loading.ask ? "Thinking..." : "Ask Question"}
        </button>

        {answer && (
          <div className="answer">
            <h3>Answer</h3>
            <p>{answer.answer}</p>

            {answer.sources?.length > 0 && (
              <>
                <h4>Sources</h4>
                <ul>
                  {answer.sources.map((s, i) => (
                    <li key={i}>{s.source}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </section>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
