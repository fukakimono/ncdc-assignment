import type { Content } from "./types";

const API_URL = "http://localhost:3000/content";

export async function getContents(): Promise<Content[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`ページ一覧の取得に失敗: ${response.status}`);
  }

  return response.json();
}
