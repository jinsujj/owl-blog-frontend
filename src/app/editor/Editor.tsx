'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import CodeTool from '@editorjs/code';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import styled from 'styled-components';

interface EditorContainerProps {
  isReadOnly: boolean;
}

export const EditorContainer = styled.div<EditorContainerProps>`
  #editorjs pre {
    border: ${(props) => (props.isReadOnly ? 'none' : '1px solid #ccc')};
  }
`;

interface EditorProps {
  isReadOnly: boolean;
  initialData?: OutputData;
  onSave?: (data: OutputData) => void;
}

const Editor: React.FC<EditorProps> = ({ isReadOnly, initialData, onSave }) => {
  const editorRef = useRef<EditorJS | null>(null);

  // 코드 블록 하이라이팅 및 변환
  const renderHighlightedCode = () => {
    const editorElement = document.querySelector('#editorjs');
    if (!editorElement) return;

    // `<textarea>` -> `<pre>` 변환 및 하이라이팅
    const codeBlocks = editorElement.querySelectorAll('.ce-code__textarea');
    codeBlocks.forEach((textarea) => {
      const codeContent = (textarea as HTMLTextAreaElement).value;

      const pre = document.createElement('pre');
      const code = document.createElement('code');

      code.textContent = codeContent;
      hljs.highlightElement(code); // 하이라이팅 적용

      pre.appendChild(code);
      textarea.parentNode?.replaceChild(pre, textarea); // `<textarea>`를 `<pre>`로 교체
    });
  };

  useEffect(() => {
    // Editor.js 인스턴스 생성
    editorRef.current = new EditorJS({
      holder: 'editorjs',
      readOnly: isReadOnly,
      data: initialData || { blocks: [] },
      tools: {
        code: CodeTool,
      },
      onReady: () => {
        if (isReadOnly) {
          renderHighlightedCode(); // 읽기 전용 모드에서 코드 하이라이팅 적용
        }
      },
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isReadOnly, initialData]);

  // 코드 블록이 동적으로 추가될 경우 하이라이팅 적용
  useEffect(() => {
    if (!isReadOnly) return;

    const editorElement = document.querySelector('#editorjs');
    if (!editorElement) return;

    const observer = new MutationObserver(() => {
      renderHighlightedCode();
    });

    observer.observe(editorElement, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [isReadOnly]);

  const handleSave = async () => {
    if (!editorRef.current) return;

    const savedData = await editorRef.current.save();
    if (onSave) onSave(savedData);
  };

  return (
    <EditorContainer isReadOnly={isReadOnly}>
      <div id="editorjs" style={{ border: '1px solid #ccc', padding: '10px' }}></div>
      {!isReadOnly && (
        <button onClick={handleSave} style={{ marginTop: '10px', padding: '5px 10px' }}>
          Save
        </button>
      )}
    </EditorContainer>
  );
};

export default Editor;
