export function isValidTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 50;
}
