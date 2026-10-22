import { expect, test } from "vitest";
import { isValidBody, isValidTitle } from "../src/features/content/validation";

test("タイトルは空白だけを拒否し、1〜50文字に制限する", () => {
  expect(isValidTitle("")).toBe(false);
  expect(isValidTitle("　 ")).toBe(false);
  expect(isValidTitle("あ")).toBe(true);
  expect(isValidTitle("あ".repeat(50))).toBe(true);
  expect(isValidTitle("あ".repeat(51))).toBe(false);
  expect(isValidTitle(` ${"あ".repeat(49)} `)).toBe(false);
});

test("本文は空白だけを拒否し、10〜2000文字に制限する", () => {
  expect(isValidBody(" \n".repeat(5))).toBe(false);
  expect(isValidBody("あ".repeat(9))).toBe(false);
  expect(isValidBody("あ".repeat(10))).toBe(true);
  expect(isValidBody("あ".repeat(2000))).toBe(true);
  expect(isValidBody("あ".repeat(2001))).toBe(false);
  expect(isValidBody(`${"あ".repeat(9)}\n`)).toBe(true);
  expect(isValidBody(`${"あ".repeat(2000)}\n`)).toBe(false);
});
