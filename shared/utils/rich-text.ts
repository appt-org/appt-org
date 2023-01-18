import { Block, Inline, MARKS, Text } from '@contentful/rich-text-types';

export function getRichTextNodeValue(node: Block | Inline): string | undefined {
  const headingTextNode = node.content.find(nodeChild => nodeChild.nodeType === 'text') as Text | undefined;
  return headingTextNode?.value;
}

export function inlineNodeContainsCodeMark(node: Block | Inline) {
  return node.content.some(item => 'marks' in item && item.marks.some(mark => mark.type === MARKS.CODE));
}
