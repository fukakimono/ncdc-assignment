import logo from "@assets/img/icon/logo.svg";
import type { Content, ContentOperation } from "../types";
import "./Sidebar.css";

interface SidebarProps {
  contents: Content[];
  loading: boolean;
  error: string | null;
  selectedId: number | null;
  operation: ContentOperation;
  onSelect: (id: number) => void;
}

export function Sidebar({
  contents,
  loading,
  error,
  selectedId,
  operation,
  onSelect,
}: SidebarProps) {
  const busy = operation !== "idle";

  return (
    <aside className="sidebar" aria-label="ページ一覧">
      <div className="service-name">
        <img src={logo} alt="" width="32" height="32" />
        <span>ServiceName</span>
      </div>
      {loading ? (
        <p className="sidebar-message" role="status">
          読み込み中…
        </p>
      ) : error ? (
        <p className="sidebar-message" role="alert">
          {error}
        </p>
      ) : contents.length === 0 ? (
        <p className="sidebar-message">ページがない。</p>
      ) : (
        <ul className="page-list">
          {contents.map((content) => (
            <li key={content.id} className="page-list-item">
              <button
                className="page-list-button"
                type="button"
                onClick={() => onSelect(content.id)}
                disabled={busy}
                aria-current={content.id === selectedId ? "page" : undefined}
              >
                {/* APIはタイトルにnull・空文字を許容するため、表示時のみ「無題」で補う */}
                {content.title || "無題"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
