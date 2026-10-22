import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import App from "../src/App";
import "../src/index.css";
import {
  createContent,
  deleteContent,
  getContent,
  getContents,
  updateContent,
} from "../src/features/content/api";
import type { Content } from "../src/features/content/types";

vi.mock("../src/features/content/api", () => ({
  getContents: vi.fn(),
  getContent: vi.fn(),
  createContent: vi.fn(),
  updateContent: vi.fn(),
  deleteContent: vi.fn(),
}));

const firstPage = {
  id: 1,
  title: "最初のページ",
  body: "最初のページの本文です。",
  createdAt: "2026-10-22T00:00:00.000Z",
  updatedAt: "2026-10-22T00:00:00.000Z",
} satisfies Content;
const secondPage = {
  ...firstPage,
  id: 2,
  title: "次のページ",
  body: "次のページの本文です。",
};
const sidebar = page.getByRole("complementary", { name: "ページ一覧" });
const main = page.getByRole("main", { name: "ページ本文" });
const heading = main.getByRole("heading");
const titleInput = main.getByRole("textbox", { name: "タイトル" });
const bodyInput = main.getByRole("textbox", { name: "本文" });
const editButtons = main.getByRole("button", { name: "Edit" });
const saveButton = main.getByRole("button", { name: "Save" });
const cancelButtons = main.getByRole("button", { name: "Cancel" });
const errorMessage = main.getByRole("alert");
const newPageButton = sidebar.getByRole("button", { name: "New page" });

let container: HTMLDivElement;
let root: Root;

beforeEach(async () => {
  vi.resetAllMocks();
  vi.mocked(getContents).mockResolvedValue([firstPage, secondPage]);
  vi.mocked(getContent).mockImplementation(async (id) => {
    const content = [firstPage, secondPage].find((item) => item.id === id);
    if (!content) throw new Error("ページが見つかりません。");
    return content;
  });
  vi.mocked(updateContent).mockImplementation(async (_id, input) => ({ ...firstPage, ...input }));

  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  root.render(<App />);
  await sidebar.getByRole("button", { name: "最初のページ", exact: true }).click();
  await expect.element(heading).toHaveTextContent("最初のページ");
});

afterEach(() => {
  root.unmount();
  container.remove();
  vi.restoreAllMocks();
});

test("タイトルだけを保存し、前後の空白を残して見出しと一覧に反映する", async () => {
  const title = " 新しいタイトル ";
  await editButtons.first().click();
  await expect.element(titleInput).toHaveAttribute("maxlength", "50");
  await titleInput.fill("　 ");
  await expect.element(saveButton).toBeDisabled();
  await titleInput.fill(title);
  await expect.element(main.getByText("9/50")).toBeInTheDocument();
  await saveButton.click();

  expect(updateContent).toHaveBeenCalledExactlyOnceWith(1, { title });
  await expect.element(main.getByRole("textbox")).not.toBeInTheDocument();
  await expect.element(heading).toHaveTextContent("新しいタイトル");
  await expect
    .element(sidebar.getByRole("button", { name: "新しいタイトル", exact: true }))
    .toHaveAttribute("aria-current", "page");
  await expect.element(main.getByText(firstPage.body)).toBeInTheDocument();
});

test("本文だけを保存し、空白と改行をそのまま渡す", async () => {
  const body = " 変更後の本文です。\n次の行 ";
  await editButtons.last().click();
  await expect.element(bodyInput).toHaveAttribute("maxlength", "2000");
  await bodyInput.fill("あ".repeat(9));
  await expect.element(saveButton).toBeDisabled();
  await bodyInput.fill(body);
  await expect.element(main.getByText(`${body.length}/2000`)).toBeInTheDocument();
  await saveButton.click();

  expect(updateContent).toHaveBeenCalledExactlyOnceWith(1, { body });
  await expect.element(main.getByRole("textbox")).not.toBeInTheDocument();
  await expect.element(main.getByText("変更後の本文です。 次の行")).toBeInTheDocument();
  await expect.element(heading).toHaveTextContent(firstPage.title);
});

test("Cancelでは保存せず、タイトルも本文も元の内容に戻す", async () => {
  await editButtons.first().click();
  await titleInput.fill("未保存のタイトル");
  await editButtons.click();
  await bodyInput.fill("未保存の本文を入力しています。");
  await cancelButtons.first().click();
  await cancelButtons.click();

  expect(updateContent).not.toHaveBeenCalled();
  await editButtons.first().click();
  await editButtons.click();
  await expect.element(titleInput).toHaveValue(firstPage.title);
  await expect.element(bodyInput).toHaveValue(firstPage.body);
});

test("保存に失敗してもタイトルの入力を残し、同じ内容で再試行できる", async () => {
  vi.mocked(updateContent).mockRejectedValueOnce(new Error("通信失敗"));
  const title = "変更後のタイトル";
  await editButtons.first().click();
  await titleInput.fill(title);
  await saveButton.click();

  await expect.element(errorMessage).toHaveTextContent("タイトルを保存できませんでした。");
  await expect.element(titleInput).toHaveValue(title);
  await saveButton.click();
  expect(updateContent).toHaveBeenCalledTimes(2);
  expect(updateContent).toHaveBeenLastCalledWith(1, { title });
  await expect.element(errorMessage).not.toBeInTheDocument();
  await expect.element(heading).toHaveTextContent(title);
});

test("保存に失敗しても本文の入力を残し、同じ内容で再試行できる", async () => {
  vi.mocked(updateContent).mockRejectedValueOnce(new Error("通信失敗"));
  const body = "変更後の本文を入力しています。";
  await editButtons.last().click();
  await bodyInput.fill(body);
  await saveButton.click();

  await expect.element(errorMessage).toHaveTextContent("本文を保存できませんでした。");
  await expect.element(bodyInput).toHaveValue(body);
  await expect.element(saveButton).toBeEnabled();
  await saveButton.click();
  expect(updateContent).toHaveBeenCalledTimes(2);
  expect(updateContent).toHaveBeenLastCalledWith(1, { body });
  await expect.element(errorMessage).not.toBeInTheDocument();
  await expect.element(main.getByText(body)).toBeInTheDocument();
});

test("保存の応答を待つ間は編集とサイドバー操作を止め、完了後に戻す", async () => {
  let finishSave!: (content: Content) => void;
  vi.mocked(updateContent).mockReturnValueOnce(
    new Promise((resolve) => {
      finishSave = resolve;
    }),
  );
  await sidebar.getByRole("button", { name: "Edit" }).click();
  await editButtons.first().click();
  await saveButton.click();

  await expect.element(titleInput).toBeDisabled();
  await expect.element(cancelButtons).toBeDisabled();
  await expect.element(main.getByRole("button", { name: "保存中…" })).toBeDisabled();
  await expect
    .element(sidebar.getByRole("button", { name: "次のページ", exact: true }))
    .toBeDisabled();
  await expect.element(newPageButton).toBeDisabled();
  await expect.element(sidebar.getByRole("button", { name: "最初のページを削除" })).toBeDisabled();
  await expect.element(sidebar.getByRole("button", { name: "Done" })).toBeDisabled();
  expect(updateContent).toHaveBeenCalledTimes(1);

  finishSave(firstPage);
  await expect.element(main.getByRole("textbox")).not.toBeInTheDocument();
  await expect.element(newPageButton).toBeEnabled();
});

test("別のページに切り替えたら未保存の編集を破棄する", async () => {
  await editButtons.first().click();
  await titleInput.fill("未保存のタイトル");
  await editButtons.click();
  await bodyInput.fill("未保存の本文を入力しています。");
  await sidebar.getByRole("button", { name: "次のページ", exact: true }).click();

  await expect.element(heading).toHaveTextContent(secondPage.title);
  await expect.element(main.getByRole("textbox")).not.toBeInTheDocument();
  await sidebar.getByRole("button", { name: "最初のページ", exact: true }).click();
  await expect.element(heading).toHaveTextContent(firstPage.title);
  await expect.element(main.getByText(firstPage.body)).toBeInTheDocument();
  expect(updateContent).not.toHaveBeenCalled();
});

test("空のページを追加して選択し、未保存の編集は引き継がない", async () => {
  vi.mocked(createContent).mockResolvedValue({ ...firstPage, id: 3, title: "", body: "" });
  const addedPageButton = sidebar.getByRole("button", { name: "無題", exact: true });
  await editButtons.first().click();
  await titleInput.fill("未保存のタイトル");
  await editButtons.click();
  await bodyInput.fill("未保存の本文を入力しています。");
  await sidebar.getByRole("button", { name: "Edit" }).click();
  await newPageButton.click();

  expect(createContent).toHaveBeenCalledExactlyOnceWith({ title: "", body: "" });
  await expect.element(addedPageButton).toHaveAttribute("aria-current", "page");
  await expect
    .element(sidebar.getByRole("button", { name: firstPage.title, exact: true }))
    .toBeInTheDocument();
  await expect.element(heading).toHaveTextContent("無題");
  await expect.element(main.getByRole("textbox")).not.toBeInTheDocument();
  await editButtons.first().click();
  await editButtons.click();
  await expect.element(titleInput).toHaveValue("");
  await expect.element(bodyInput).toHaveValue("");
});

test("削除確認でキャンセルでき、確定すると一覧から消えて選択が解除される", async () => {
  vi.mocked(deleteContent).mockResolvedValue(undefined);
  vi.spyOn(window, "confirm").mockReturnValueOnce(false).mockReturnValueOnce(true);
  const removeButton = sidebar.getByRole("button", { name: "最初のページを削除" });
  const removedPageButton = sidebar.getByRole("button", { name: firstPage.title, exact: true });
  await sidebar.getByRole("button", { name: "Edit" }).click();
  await removeButton.click();
  expect(deleteContent).not.toHaveBeenCalled();
  await expect.element(heading).toHaveTextContent(firstPage.title);

  await removeButton.click();
  expect(deleteContent).toHaveBeenCalledExactlyOnceWith(firstPage.id);
  await expect.element(removedPageButton).not.toBeInTheDocument();
  await expect.element(main.getByText("ページを選択してください。")).toBeInTheDocument();
  await expect
    .element(sidebar.getByRole("button", { name: secondPage.title, exact: true }))
    .toBeEnabled();
});
