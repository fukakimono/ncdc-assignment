import { useState } from "react";
import { Button } from "../../../components/Button";
import { isValidBody } from "../validation";
import "./BodyEditor.css";

interface BodyEditorProps {
  body: string | null;
  saving: boolean;
  disabled: boolean;
  onSave: (body: string) => Promise<void>;
}

export function BodyEditor({ body, saving, disabled, onSave }: BodyEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const canSave = isValidBody(draft);

  const handleEdit = () => {
    setDraft(body ?? "");
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
      setError("本文を保存できませんでした。");
    }
  };

  return (
    <>
      <div className="body-field">
        {editing ? (
          <textarea
            className="body-input"
            aria-label="本文"
            aria-describedby={error ? "body-count body-error" : "body-count"}
            placeholder="ここに本文を入力してください。"
            maxLength={2000}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={disabled}
            autoFocus
          />
        ) : (
          <p className="content-body">{body}</p>
        )}
        {editing && (
          <div className="body-feedback">
            {error && (
              <p id="body-error" className="body-error" role="alert">
                {error}
              </p>
            )}
            <span id="body-count" className="body-count">
              {draft.length}/2000
            </span>
          </div>
        )}
      </div>
      <div className="body-actions">
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
