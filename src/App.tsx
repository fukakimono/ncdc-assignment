import { Fragment, useEffect, useState } from "react";
import { BodyEditor } from "./features/content/components/BodyEditor";
import { TitleEditor } from "./features/content/components/TitleEditor";
import { Sidebar } from "./features/content/components/Sidebar";
import {
  createContent,
  deleteContent,
  getContent,
  getContents,
  updateContent,
} from "./features/content/api";
import type { Content, ContentOperation, UpdateContentInput } from "./features/content/types";
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
      title: "",
      body: "",
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

  const handleSaveContent = async (input: UpdateContentInput) => {
    if (!selectedContent) return;

    setOperation("saving");
    try {
      const content = await updateContent(selectedContent.id, input);
      setSelectedContent(content);
      setContents((current) => current.map((item) => (item.id === content.id ? content : item)));
    } finally {
      setOperation("idle");
    }
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
      <main className="main-area" aria-label="ページ本文" aria-busy={operation === "selecting"}>
        <section className="content-panel">
          {detailError ? (
            <p className="content-message" role="alert">
              {detailError}
            </p>
          ) : selectedContent ? (
            <Fragment key={selectedContent.id}>
              <TitleEditor
                title={selectedContent.title}
                saving={operation === "saving"}
                disabled={operation !== "idle"}
                onSave={(title) => handleSaveContent({ title })}
              />
              <BodyEditor
                body={selectedContent.body}
                saving={operation === "saving"}
                disabled={operation !== "idle"}
                onSave={(body) => handleSaveContent({ body })}
              />
            </Fragment>
          ) : !loading && operation !== "selecting" ? (
            <p className="content-message">ページを選択してください。</p>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default App;
