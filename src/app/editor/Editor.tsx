'use client';

import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import styled from 'styled-components';
import Button from '../components/common/Button';
import palette from '../styles/palette';
import EditorJS, { BlockToolConstructable, OutputData } from '@editorjs/editorjs';
import CodeTool from '@editorjs/code';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Warning from '@editorjs/warning';
import Marker from '@editorjs/marker';
import Table from '@editorjs/table';
import Embed from '@editorjs/embed';
import LinkTool from '@editorjs/link';

interface EditorContainerProps {
  $isReadOnly: boolean;
  $maxWidth: string;
}

export const EditorContainer = styled.div<EditorContainerProps>`
  #editorjs pre {
    border: ${(props) => (props.$isReadOnly ? "none" : "1px solid #ccc")};
  }

	.ce-toolbar__content {
		max-width: ${(props) => props.$maxWidth};
	}

	.ce-block__content {
    max-width: ${(props) => props.$maxWidth};
    margin: 0 auto;
    position: relative;
  }

	.cdx-warning__message{
		display: none;
	}

	.embed-tool__caption {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		border: none;
		color: ${palette.gray}
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
			autofocus: true,
      tools: {
				list: {
					class: List as unknown as BlockToolConstructable,
					inlineToolbar: true,
					shortcut: 'OPTION+A', 
				},
				warning: {
					class: Warning,
					inlineToolbar: true,
					shortcut: 'OPTION+W',
					config: { 
						titlePlaceholder: 'Title',
						messagePlaceholder: 'Message',
					},
				},
				embed: {
					class: Embed,
					config: {
						services: {
							youtube: true,
						}
					}
				},
				Marker: {
					class: Marker,
					shortcut: 'OPTION+M',
				},
				linkTool: {
					class: LinkTool,
					config: {
						endpoint: 'https://api.microlink.io?url=', // Your backend endpoint for url data fetching,
					},
				},
				table: {
					class: Table as unknown as BlockToolConstructable,
					shortcut: 'OPTION+T',
					inlineToolbar: true,
					config: {
						rows: 2,
						cols: 3,
						maxRows: 5,
						maxCols: 5,
					},
				},
				header: {
					class: Header as unknown as BlockToolConstructable,
					inlineToolbar: ['link', 'marker', 'bold', 'italic'], // 추가로 원하는 툴
					config: {
						levels: [1, 2, 3, 4, 5], 
						defaultLevel: 2, 
						placeholder: 'Write a header', // 기본 텍스트
					},
				},
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
					<Button onClick={handleSave} color={palette.blue}>
						Save
					</Button>
				)}
		</>
  );
};

export default Editor;
