export type ContentOperation = "idle" | "selecting" | "creating" | "deleting" | "saving";

export interface Content {
  id: number;
  title: string | null;
  body: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentInput {
  title?: string;
  body?: string;
}

export interface UpdateContentInput {
  title?: string;
  body?: string;
}
