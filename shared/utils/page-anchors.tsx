export type PageAnchor = {
  text: string;
  id: string;
};

export function getPageAnchorId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}
