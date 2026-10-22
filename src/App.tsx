import { useEffect, useState } from "react";
import { Sidebar } from "./features/content/components/Sidebar";
import { createContent, deleteContent, getContent, getContents } from "./features/content/api";
import type { Content, ContentOperation } from "./features/content/types";
import "./App.css";

function App() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [operation, setOperation] = useState<ContentOperation>("idle");
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    getContents()
      .then((data) => setContents(data))
      .catch(() => setError("ページを取得できませんでした。"))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (id: number) => {
    setDetailError(null);
    setOperation("selecting");

    getContent(id)
      .then((data) => setSelectedContent(data))
      .catch(() => setDetailError("ページ詳細を取得できませんでした。"))
      .finally(() => setOperation("idle"));
  };

  const handleCreate = () => {
    setOperation("creating");
    setDetailError(null);

    createContent({
      title: "新しいページ",
      body: "ここに本文を入力してください。",
    })
      .then((content) => {
        setContents((current) => [...current, content]);
        setSelectedContent(content);
      })
      .catch(() => setDetailError("ページを作成できませんでした。"))
      .finally(() => setOperation("idle"));
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("このページを削除しますか？")) return;

    setOperation("deleting");
    setDetailError(null);

    deleteContent(id)
      .then(() => {
        setContents((current) => current.filter((content) => content.id !== id));
        setSelectedContent((current) => (current?.id === id ? null : current));
      })
      .catch(() => setDetailError("ページを削除できませんでした。"))
      .finally(() => setOperation("idle"));
  };

  return (
    <div className="app">
      <Sidebar
        contents={contents}
        loading={loading}
        error={error}
        selectedId={selectedContent?.id ?? null}
        operation={operation}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />
      <main className="main-area" aria-label="ページ本文">
        <section className="content-panel">
          {operation === "selecting" ? (
            <p className="content-message" role="status">
              読み込み中…
            </p>
          ) : detailError ? (
            <p className="content-message" role="alert">
              {detailError}
            </p>
          ) : selectedContent ? (
            <>
              {/* APIはタイトルにnull・空文字を許容するため、表示時のみ「無題」で補う */}
              <h1 className="content-title">{selectedContent.title || "無題"}</h1>
              <p className="content-body">{selectedContent.body}</p>
            </>
          ) : (
            <p className="content-message">ページを選択してください。</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
