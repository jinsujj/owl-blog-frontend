'use client';

import React, { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import CodeTool from '@editorjs/code';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import styled from 'styled-components';

interface EditorContainerProps {
  $isReadOnly: boolean;
  $maxWidth: string;
}

export const EditorContainer = styled.div<EditorContainerProps>`
  #editorjs pre {
    border: ${(props) => (props.$isReadOnly ? "none" : "1px solid #ccc")};
  }

  .ce-block__content {
    max-width: ${(props) => props.$maxWidth};
    margin: 0 auto;
    position: relative;
  }
`;


interface EditorProps {
  isReadOnly: boolean;
  initialData?: OutputData;
	editorMaxWidth: string;
  onSave?: (data: OutputData) => void;
}

const Editor: React.FC<EditorProps> = ({ isReadOnly, initialData,editorMaxWidth, onSave }) => {
  const editorRef = useRef<EditorJS | null>(null);

  const renderHighlightedCode = () => {
    const editorElement = document.querySelector('#editorjs');
    if (!editorElement) return;

    const codeBlocks = editorElement.querySelectorAll('.ce-code__textarea');
    codeBlocks.forEach((textarea) => {
      const codeContent = (textarea as HTMLTextAreaElement).value;
      const pre = document.createElement('pre');
      const code = document.createElement('code');

      code.textContent = codeContent;
      hljs.highlightElement(code);

      pre.appendChild(code);
      textarea.parentNode?.replaceChild(pre, textarea); // `<textarea>` -> `<pre>`
    });
  };

  useEffect(() => {    
    editorRef.current = new EditorJS({
      holder: 'editorjs',
      readOnly: isReadOnly,
      data: initialData,
      tools: {
        code: CodeTool,
      },
      onReady: () => {
        if (isReadOnly) {
          renderHighlightedCode(); 
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
		<>
			<EditorContainer $isReadOnly={isReadOnly} $maxWidth={editorMaxWidth}>
				<div id="editorjs" style={{ border: '1px solid #ccc', padding: '10px' }}></div>
			</EditorContainer>
				{!isReadOnly && (
					<button onClick={handleSave} style={{ marginTop: '10px', padding: '5px 10px' }}>
						Save
					</button>
				)}
		</>
  );
};

export default Editor;
