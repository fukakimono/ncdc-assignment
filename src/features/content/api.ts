import type { Content, CreateContentInput, UpdateContentInput } from "./types";

const API_URL = "http://localhost:3000/content";

export async function getContents(): Promise<Content[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`ページ一覧の取得に失敗: ${response.status}`);
  }

  return response.json();
}

export async function getContent(id: number): Promise<Content> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`ページ詳細の取得に失敗: ${response.status}`);
  }

  const content: Content | null = await response.json();
  if (!content) throw new Error("ページが見つかりません。");

  return content;
}

export async function createContent(input: CreateContentInput): Promise<Content> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`ページの作成に失敗: ${response.status}`);
  }

  return response.json();
}

export async function updateContent(id: number, input: UpdateContentInput): Promise<Content> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`ページの更新に失敗: ${response.status}`);
  }

  const content: Content | null = await response.json();
  if (!content) throw new Error("ページが見つかりません。");

  return content;
}

export async function deleteContent(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(`ページの削除に失敗: ${response.status}`);
  }
}
