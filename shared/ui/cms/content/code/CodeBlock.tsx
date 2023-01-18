import Prism from 'prismjs';
import { useEffect, useRef } from 'react';
import { CodeBlockApiModel } from 'shared/api/api-types';

export type CodeBlockProps = {
  block: CodeBlockApiModel;
};

export default function CodeBlock({ block }: CodeBlockProps) {
  const codeEl = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!codeEl.current) {
      return;
    }

    Prism.highlightElement(codeEl.current);
  }, [block.code]);

  return (
    <pre className={`language-${block.programmingLanguage.prismLanguage}`} tabIndex={0}>
      <code className={`language-${block.programmingLanguage.prismLanguage}`} ref={codeEl}>
        {block.code}
      </code>
    </pre>
  );
}
