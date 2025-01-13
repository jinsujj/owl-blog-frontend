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
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa'; 
import { MdEdit, MdVisibility } from 'react-icons/md';

interface EditorContainerProps {
  $isReadOnly: boolean;
  $maxwidth: string;
	$isDark:boolean;
}

export const EditorContainer = styled.div<EditorContainerProps>`
	max-width: ${(props) => props.$maxwidth};
	margin: 0 auto;
	width: 100%;


  #editorjs pre {
    border: ${(props) => (props.$isReadOnly ? "none" : "1px solid #ccc")};
  }

	.ce-toolbar__content {
		max-width: ${(props) => props.$maxwidth};
	}

	.ce-block__content {
    max-width: ${(props) => props.$maxwidth};
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
	display: flex;
	gap:10px;
	width: 100%;
  font-size: 28px; 
  padding-top: 20px;
	padding-bottom: 10px;
  transition: border-color 0.3s, box-shadow 0.3s;
	align-items: center;

  &:focus {
    border-color: ${palette.blue};
    box-shadow: 0 0 5px ${palette.blue};
    outline: none; 
  }
`;

const TitleInput = styled.input<{width: string, $isDark:boolean}>`
  background-color: ${(props) => (props.$isDark ? "#333" : "#ddd")} !important; 
	width: 100%;
	max-width: ${(props) => props.width};
	font-size: 24px;
	padding: 10px;
	border: none;
	border-radius: 4px;
	height:100%;;
`;

const StyledEditor = styled.div`
  border-top: 1px solid #ccc; 
  border-bottom: 1px solid #ccc;
	width: 100%;
	box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
`;

const BlogActionWrapper = styled.div`
  display: flex;
  justify-content: space-between; /* 좌우로 배치 */
  align-items: center; 
  gap: 20px; 
  margin-top: 20px; 
`;

const ThumbnailWrapper = styled.div`
  width: 50%;
	display: flex;
  flex-direction: column; 
  align-items: center;
	justify-content: center;
  padding: 20px; 
  background-color: ${palette.lightGray}; 
  border: 1px solid ${palette.gray}; 
  border-radius: 8px; 
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); 
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.15); /* 호버 시 그림자 강조 */
  }
`;

const ThumbnailPreview = styled.div<{maxwidth: string}>`
	width: 90%;
	max-width: ${(props) => props.maxwidth || '200px'};
	margin-bottom: 10px;
	img {
		width: 100%;
		height: auto;
		border-radius: 8px;
		object-fit: cover;
		border: 1px solid ${palette.gray};
		box-shadow: 0px 2px 5px hsla(0, 0%, 0%, 0.1);
	}
`;

const ThumbnailInputWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const RemoveThumbnailIcon = styled(FaTimes)`
  color: ${palette.gray}; 
  font-size: 20px; 
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: ${palette.darkRed}; 
  }
`;

const ThumbnailInput = styled.input`
	display: none !important;
`;

const ThumbnailLabel = styled.label`
  margin-right: 10px;
	cursor: pointer;
	display: inline-block;
	background-color: ${palette.gray};
	color: white;
	padding: 8px 12px;
	border-radius: 4px;
	text-align: center;
	font-size: 14px;
	&:hover {
		background-color: ${palette.darkGray};
	}
`;

const FileName = styled.span`
  font-size: 14px;
  color: ${palette.gray};
  margin-top: 5px; 
  text-align: center;
`;

const IconButton = styled.button<{ $isReadOnly: boolean , $isDark: boolean}>`
	background-color: ${(props) => props.$isDark ? "#1e1e1e" : "#f9f9f9"}; 
  color: ${(props) => (props.$isDark ? "#fff" : "#333")};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px; 
  height: 34px; 
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: ${(props) => (props.$isReadOnly ? palette.darkBlue : palette.darkBlue)};
  }

  &:active {
    transform: scale(0.95); 
  }

  svg {
    font-size: 24px;
  }
`;


interface EditorProps {
  initialData?: BlogOutputData;
	editorMaxWidth: string;
  onSave?: (data: BlogOutputData) => void;
}

const Editor: React.FC<EditorProps> = ({ initialData, editorMaxWidth, onSave }) => {
	const isDarkMode = useSelector((state) => state.common.isDark);
	const [title , setTitle] = useState('');
	const [isReadOnly, setIsReadOnly] = useState(false);
	const [thumbnail, setThumbnail] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string>('선택된 파일 없음');
  const editorRef = useRef<EditorJS | null>(null);

	const toggleMode = () => {
		setIsReadOnly((prev) => !prev);
	}

	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
			setFileName(file.name);
			console.log(file);
      const reader = new FileReader();
      reader.onload = () => {
				if (typeof reader.result === 'string') {
					setThumbnail(reader.result);
				}
			};
      reader.readAsDataURL(file);
    }
  };

	const handleRemoveThumbnail = () => {
    setThumbnail(null);
    setFileName('선택된 파일 없음'); 
  };

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

	const truncateFileName = (fileName: string, maxLength: number): string => {
		if (fileName.length <= maxLength) return fileName;
	
		const fileExtension = fileName.substring(fileName.lastIndexOf('.')); 
		const baseName = fileName.substring(0, fileName.lastIndexOf('.')); 
	
		const truncatedBaseName = baseName.slice(0, maxLength - fileExtension.length - 3); 
		return `${truncatedBaseName}...${fileExtension}`;
	};
	
  return (
		<>
			<EditorContainer $isReadOnly={isReadOnly} $maxwidth={editorMaxWidth} $isDark={isDarkMode}>
				<TitleInputWrapper>
					<TitleInput $isDark={isDarkMode}
								type="text"
								placeholder="제목을 입력하세요 ..."
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								readOnly={isReadOnly}
								width={editorMaxWidth}
							/>
					<IconButton $isReadOnly={isReadOnly} $isDark={isDarkMode} onClick={toggleMode}>
						{isReadOnly ? <MdVisibility /> : <MdEdit />}
					</IconButton>
				</TitleInputWrapper>
				<StyledEditor id="editorjs"></StyledEditor>
				<BlogActionWrapper>
					{!isReadOnly && (
						<ThumbnailWrapper>
							{thumbnail && (
								<ThumbnailPreview maxwidth={editorMaxWidth}>
									<Image
										src={thumbnail}
										alt="Thumbnail preview"
										layout="responsive"
										width={400}
										height={200}
									/>
								</ThumbnailPreview>
							)}
							<ThumbnailInputWrapper>
								<ThumbnailInput
									id="thumbnail-input"
									type="file"
									accept="image/*"
									onChange={handleThumbnailChange}
								/>
								<ThumbnailLabel htmlFor="thumbnail-input">
									{thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
								</ThumbnailLabel>
								{thumbnail && (
									<RemoveThumbnailIcon onClick={handleRemoveThumbnail} />
								)}
							</ThumbnailInputWrapper>
							<FileName>{truncateFileName(fileName, 40)}</FileName>
						</ThumbnailWrapper>
					)}
					{!isReadOnly && (
						<Button onClick={handleSave} color={palette.blue} width='120px'>
							Save
						</Button>
					)}
				</BlogActionWrapper>
			</EditorContainer>
		</>
  );
};

export default Editor;
