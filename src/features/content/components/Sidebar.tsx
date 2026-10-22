import logo from "@assets/img/icon/logo.svg";
import type { Content } from "../types";
import "./Sidebar.css";

interface SidebarProps {
  contents: Content[];
  loading: boolean;
  error: string | null;
}

export function Sidebar({ contents, loading, error }: SidebarProps) {
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
              {/* APIはタイトルにnull・空文字を許容するため、表示時のみ「無題」で補う */}
              <span className="page-list-title">{content.title || "無題"}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
