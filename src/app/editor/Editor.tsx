'use client';

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
import Delimiter from '@editorjs/delimiter';
import RawTool from '@editorjs/raw';
import ImageTool from '@editorjs/image';
import AttachesTool from '@editorjs/attaches';
import { useSelector } from '../store';
import { Thumbnail } from '../components/editor/Thumbnail';
import { useEffect, useMemo, useRef, useState } from 'react';
import { publishBlog, unPublishBlog } from '../api/blogApi';
import useModal from '../hooks/useModal';
import ConfirmModal from '../components/modal/ConfirmModal';
import { uploadThumbnail } from '../api/thumbnailApi';
import DeleteImageTune from './DeleteImageTune';

interface EditorContainerProps {
	$isReadOnly: boolean;
	$maxwidth: string;
	$isDark: boolean;
}

const EditorContainer = styled.div<EditorContainerProps>`
	max-width: ${(props) => props.$maxwidth};
	margin: 0 auto;
	width: 100%;

	.ce-code__textarea {
  	display: ${(props) => (props.$isReadOnly ? "none" : "block" )};
	}

	.highlighted-code {
		display: ${(props) => (props.$isReadOnly ? "block" : "none" )};
	}


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

	.image-tool__image {
		background-color: transparent !important;
	}

	.image-tool__caption{
		display: none !important;
	}
`;

const StyledEditor = styled.div`
  border-top: 1px solid #ccc; 
  border-bottom: 1px solid #ccc;
	width: 100%;
	box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
`;

const BlogActionWrapper = styled.div`
  display: flex;
  justify-content: space-between; 
  gap: 20px; 
  margin-top: 20px; 
`;

const ButtonWrapper = styled.div`
	display: flex;
`;


interface EditorProps {
	initialData?: OutputData;
	editorMaxWidth: string;
	onSave?: (data: OutputData) => void;
	isReadOnly: boolean;
	imageUrl: string;
	setImageUrl?: (imageUrl: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialData, editorMaxWidth, onSave, isReadOnly, imageUrl, setImageUrl }) => {
	// modal
	const { openModal, closeModal, ModalPortal } = useModal();
	const [modalMessage, setModalMessage] = useState('');
	// blog
	const blogId = useSelector((state) => state.common.postId);
	const postState = useSelector((state) => state.common.postState);
	// state 
	const isDarkMode = useSelector((state) => state.common.isDark);
	const isPublished = postState === 'published'
	const editorRef = useRef<EditorJS | null>(null);



	const parsedInitialData = useMemo(() => {
		if (typeof initialData === 'string') {
			try {
				return JSON.parse(initialData);
			} catch (error) {
				console.error('Error parsing initialData:', error);
				return null;
			}
		}
		return initialData;
	}, [initialData]);

	const renderHighlightedCode = () => {
		const editorElement = document.querySelector('#editorjs');
		if (!editorElement) return;

		const codeBlocks = editorElement.querySelectorAll('.ce-code__textarea');
		codeBlocks.forEach((textarea) => {
			const parent = textarea.parentNode;
    	if (!parent) return;
			
			const codeContent = (textarea as HTMLTextAreaElement).value;
			// 기존에 하이라이트된 코드가 있다면 삭제
			const existingHighlight = textarea.parentNode?.querySelector('.ce-code__textarea cdx-input');
			if (existingHighlight) {
				existingHighlight.remove();
			}

			// 새로운 코드 블록 생성
			const pre = document.createElement('pre');
			const code = document.createElement('code');

			code.textContent = codeContent;
			hljs.highlightElement(code);

			pre.classList.add('highlighted-code');
			pre.appendChild(code);
			textarea.parentNode?.insertBefore(pre, textarea.nextSibling);
		});
	};

	useEffect(() => {
		const initEditor = async () => {
			if (!editorRef.current && parsedInitialData) {
				editorRef.current = new EditorJS({
					holder: 'editorjs',
					readOnly: isReadOnly,
					placeholder: 'Hello world!',
					data: parsedInitialData,
					autofocus: false,
					tools: {
						raw: { class: RawTool, shortcut: 'OPTION+R' },
						code: { class: CodeTool, shortcut: 'OPTION+C' },
						list: { class: List as unknown as BlockToolConstructable, inlineToolbar: true, shortcut: 'OPTION+O' },
						delimiter: { class: Delimiter as unknown as BlockToolConstructable, shortcut: 'OPTION+D' },
						embed: { class: Embed, config: { services: { youtube: true } } },
						Marker: { class: Marker, shortcut: 'OPTION+M' },
						warning: { class: Warning, inlineToolbar: true, shortcut: 'OPTION+W', config: { titlePlaceholder: 'Title', messagePlaceholder: 'Message', }, },
						image: {
							class: ImageTool,
							config: {
								uploader: {
									async uploadByFile(file: File) {
										try {
											const response = await uploadThumbnail(file);
											return {
												success: 1,
												file: {
													url: response.fileUrl,
												},
											};
										} catch (error) {
											console.error("Image upload failed:", error);
											return { success: 0 };
										}
									},
								},
							},
							tunes: ["deleteImage"],
						},
						deleteImage: {
							class: DeleteImageTune,
						},
						linkTool: {
							class: LinkTool, shortcut: 'OPTION+L',
							config: { endpoint: 'https://api.microlink.io?url=', }
						},
						table: {
							class: Table as unknown as BlockToolConstructable, shortcut: 'OPTION+T',
							inlineToolbar: true,
							config: { rows: 2, cols: 3, maxRows: 5, maxCols: 5, },
						},
						attaches: {
							class: AttachesTool, shortcut: 'OPTION+A',
							config: { endpoint: 'http://localhost:8008/uploadFile' }
						},
						header: {
							class: Header as unknown as BlockToolConstructable, shortcut: 'OPTION+H',
							config: { levels: [1, 2, 3, 4, 5], defaultLevel: 2, placeholder: 'Write a header', },
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
				await editorRef.current.isReady;
			}
		};
		initEditor();
	}, [parsedInitialData]);

	useEffect(() => {
		if (editorRef.current) {
			editorRef.current.readOnly?.toggle(isReadOnly);
			if (isReadOnly) {
				renderHighlightedCode();
			}
		}
	}, [isReadOnly]);

	const handleSave = async () => {
		if (!editorRef.current) return;
		
		const savedData = await editorRef.current.save();
		const blog: OutputData = { ...savedData, }
		if (onSave) onSave(blog);
	};

	const handlePublish = async () => {
		setModalMessage("해당글을 게시하시겠습니까?");
		openModal();
	}

	const handleUnPublish = async () => {
		setModalMessage("게시를 취소하겠습니까?");
		openModal();
	}

	const onConfirmPublish = async () => {
		if (isPublished === true)
			await unPublishBlog(blogId);

		if (isPublished === false)
			await publishBlog(blogId);

		window.location.href = '/';
	}


	return (
		<>
			<EditorContainer $isReadOnly={isReadOnly} $maxwidth={editorMaxWidth} $isDark={isDarkMode}>
				<StyledEditor id="editorjs"></StyledEditor>
				<ModalPortal>
					<ConfirmModal message={modalMessage} onClose={closeModal} onCancel={() => { }} onConfirm={onConfirmPublish} />
				</ModalPortal>
				<BlogActionWrapper>
					{!isReadOnly && (
						<Thumbnail editorMaxWidth={editorMaxWidth} imageUrl={imageUrl} setImageUrl={setImageUrl} />
					)}
					<ButtonWrapper>
						{!isReadOnly && (
							<Button onClick={handleSave} color={palette.blue} width='100px'>
								Save
							</Button>
						)}
						{!isReadOnly && !isPublished && (
							<Button onClick={handlePublish} color={palette.green} width='100px'>
								Publish
							</Button>
						)}
						{!isReadOnly && isPublished && (
							<Button onClick={handleUnPublish} color={palette.darkRed} width='100px'>
								unPublish
							</Button>
						)}
					</ButtonWrapper>
				</BlogActionWrapper>
			</EditorContainer>
		</>
	);
};

export default Editor;
