export function isValidTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 50;
}

export function isValidBody(body: string): boolean {
  return body.trim().length > 0 && body.length >= 10 && body.length <= 2000;
}
