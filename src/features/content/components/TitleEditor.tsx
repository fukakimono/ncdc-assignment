import { useState } from "react";
import { Button } from "../../../components/Button";
import { isValidTitle } from "../validation";
import "./TitleEditor.css";

interface TitleEditorProps {
  title: string | null;
  saving: boolean;
  disabled: boolean;
  onSave: (title: string) => Promise<void>;
}

export function TitleEditor({ title, saving, disabled, onSave }: TitleEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const canSave = isValidTitle(draft);

  const handleEdit = () => {
    setDraft(title ?? "");
    setError(null);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!canSave || disabled) return;
    setError(null);

    try {
      await onSave(draft);
      setEditing(false);
    } catch {
      setError("タイトルを保存できませんでした。");
    }
  };

  return (
    <>
      <div className="title-field">
        {editing ? (
          <input
            className="title-input"
            aria-label="タイトル"
            aria-describedby={error ? "title-count title-error" : "title-count"}
            maxLength={50}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={disabled}
            autoFocus
          />
        ) : (
          <h1 className="content-title">{title || "無題"}</h1>
        )}
        {editing && (
          <div className="title-feedback">
            {error && (
              <p id="title-error" className="title-error" role="alert">
                {error}
              </p>
            )}
            <span id="title-count" className="title-count">
              {draft.length}/50
            </span>
          </div>
        )}
      </div>
      <div className="title-actions">
        {editing ? (
          <>
            <Button
              icon="cancel"
              label="Cancel"
              variant="neutral"
              size="small"
              onClick={() => setEditing(false)}
              disabled={disabled}
            />
            <Button
              icon="save"
              label={saving ? "保存中…" : "Save"}
              size="small"
              onClick={handleSave}
              disabled={disabled || !canSave}
            />
          </>
        ) : (
          <Button icon="edit" label="Edit" onClick={handleEdit} disabled={disabled} />
        )}
      </div>
    </>
  );
}
