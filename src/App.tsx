import { useEffect, useState } from "react";
import { Sidebar } from "./features/content/components/Sidebar";
import { getContents } from "./features/content/api";
import type { Content } from "./features/content/types";
import "./App.css";

function App() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getContents()
      .then((data) => setContents(data))
      .catch(() => setError("ページを取得できませんでした。"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app">
      <Sidebar contents={contents} loading={loading} error={error} />
      <main className="main-area" aria-label="ページ本文" />
    </div>
  );
}

export default App;
