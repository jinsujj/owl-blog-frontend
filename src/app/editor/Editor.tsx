'use client';

import React, { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import styled from 'styled-components';
import Button from '../components/common/Button';
import palette from '../styles/palette';
import EditorJS, { BlockToolConstructable } from '@editorjs/editorjs';
import CodeTool from '@editorjs/code';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Warning from '@editorjs/warning';
import Marker from '@editorjs/marker';
import Table from '@editorjs/table';
import Embed from '@editorjs/embed';
import LinkTool from '@editorjs/link';
import Delimiter from '@editorjs/delimiter';
import RawTool from '@editorjs/raw';
import ImageTool from '@editorjs/image';
import AttachesTool from '@editorjs/attaches';
import { BlogOutputData } from '../types/editor';
import { useSelector } from '../store';

interface EditorContainerProps {
  $isReadOnly: boolean;
  $maxWidth: string;
	$isDark:boolean;
}

export const EditorContainer = styled.div<EditorContainerProps>`
	max-width: ${(props) => props.$maxWidth};
	margin: 0 auto;
	width: 100%;


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

	.ce-toolbar__plus {
		color: ${(props) => (props.$isDark ? "#ddd" : "#333")};
	}

	.ce-toolbar__settings-btn {
		color: ${(props) => (props.$isDark ? "#ddd" : "#333")};
	}
`;

const TitleInputWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const TitleInput = styled.input<{width: string}>`
	width: 100%;
	max-width: ${(props) => props.width};
	font-size: 24px;
	padding: 10px;
	margin-bottom: 20px;
	border: 1px solid ${palette.gray};
	border-radius: 4px;
	background-color: #f9f9f9;
`;

const StyledEditor = styled.div`
  border-top: 1px solid #ccc; 
  border-bottom: 1px solid #ccc;
	width: 100%;
	box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
`;


interface EditorProps {
  isReadOnly: boolean;
  initialData?: BlogOutputData;
	editorMaxWidth: string;
  onSave?: (data: BlogOutputData) => void;
}

const Editor: React.FC<EditorProps> = ({ isReadOnly, initialData, editorMaxWidth, onSave }) => {
	const isDarkMode = useSelector((state) => state.common.isDark);
	const [title , setTitle] = useState('');
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
		if (!editorRef.current) {
			editorRef.current = new EditorJS({
				holder: 'editorjs',
				readOnly: isReadOnly,
				placeholder :'Hello world!',
				data: initialData,
				autofocus: true,
				tools: {
					raw:{class: RawTool,shortcut: 'OPTION+R'},
					code:{class: CodeTool,shortcut: 'OPTION+C'},
					list: {class: List as unknown as BlockToolConstructable,inlineToolbar: true,shortcut: 'OPTION+O'},
					delimiter:{class: Delimiter as unknown as BlockToolConstructable,shortcut: 'OPTION+D'},
					embed: {class: Embed,config: {services: {youtube: true}}},
					Marker: {class: Marker,shortcut: 'OPTION+M'},
					warning: {class: Warning,inlineToolbar: true,shortcut: 'OPTION+W',
						config: { 
							titlePlaceholder: 'Title',
							messagePlaceholder: 'Message',
						},
					},
					image: {class: ImageTool,
						config: {
							endpoints: {
								byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
								byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
							}
						}
					},
					linkTool: {class: LinkTool,shortcut: 'OPTION+L',
						config: {
							endpoint: 'https://api.microlink.io?url=', // Your backend endpoint for url data fetching,
						},
					},
					table: {class: Table as unknown as BlockToolConstructable,shortcut: 'OPTION+T', 
						inlineToolbar: true,
						config: {
							rows: 2,
							cols: 3,
							maxRows: 5,
							maxCols: 5,
						},
					},
					attaches: {class: AttachesTool,shortcut: 'OPTION+A',
						config: {
							endpoint: 'http://localhost:8008/uploadFile'
						}
					},
					header: {class: Header as unknown as BlockToolConstructable,shortcut: 'OPTION+H',
						config: {
							levels: [1, 2, 3, 4, 5], 
							defaultLevel: 2, 
							placeholder: 'Write a header',
						},
						sanitize: {
							level: true, 
						},
					},
				},
				onReady: () => {
					if (isReadOnly) {
						renderHighlightedCode(); 
					}
				},
			});
	}

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isReadOnly, initialData]);

  const handleSave = async () => {
    if (!editorRef.current) return;

    const savedData = await editorRef.current.save();
		const blog: BlogOutputData = {...savedData,title: title,}
    if (onSave) onSave(blog);
  };
	
  return (
		<>
			<EditorContainer $isReadOnly={isReadOnly} $maxWidth={editorMaxWidth} $isDark={isDarkMode}>
				<TitleInputWrapper>
					<TitleInput 
								type="text"
								placeholder="Enter title here ..."
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								readOnly={isReadOnly}
								width={editorMaxWidth}
							/>
				</TitleInputWrapper>
				<StyledEditor id="editorjs"></StyledEditor>
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
