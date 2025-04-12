'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type EditorJS from '@editorjs/editorjs';
import type { OutputData, BlockToolConstructable } from '@editorjs/editorjs';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import styled from 'styled-components';
import { useSelector } from '@/app/store';
import useModal from '@/app/hooks/useModal';
import { publishBlog, unPublishBlog } from '@/app/api/blogApi';
import { uploadThumbnail } from '@/app/api/thumbnailApi';
import Button from '@/app/components/common/Button';
import { Thumbnail } from '@/app/components/editor/Thumbnail';
import ConfirmModal from '@/app/components/modal/ConfirmModal';
import palette from '@/app/styles/palette';

interface EditorContainerProps {
	$isReadOnly: boolean;
	$maxwidth: string;
	$isDark: boolean;
}


const EditorContainer = styled.div<EditorContainerProps>`
	max-width: ${(props) => props.$maxwidth};
	margin: 0 auto;
	width: 100%;

	.image-tool__image{
		z-index: 99999;
	}

	.image-tool__image {
		display: block; 
		margin: 0 auto; 
		max-width: 80%;
		height: auto;
	}

	.ce-code__textarea {
		font-size: 16px !important;
		display: ${(props) => (props.$isReadOnly ? "none" : "block")};
	}

	.highlighted-code {
		font-size: 16px !important;
		display: ${(props) => (props.$isReadOnly ? "block" : "none")};
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

	.custom-header {
		border-left: 4px solid red;
		padding-left: 8px;
		margin-top: .6em;
		font-size: 30px;
		font-weight: bold;
	}

	.custom-header-input {
		border: none;
		outline: none;
		font-size: 30px;
		font-weight: bold;
		width: 100%;
		background: transparent;
	}

	.custom-link-tool {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 10px;
		border: 1px solid ${(props) => (props.$isDark ? "#444" : "#ddd")};
		border-radius: 5px;
		background: ${(props) => (props.$isDark ? "#222" : "#f9f9f9")};
		color: ${(props) => (props.$isDark ? "#fff" : "#000")};
	}

	.custom-link-input {
		width: 100%;
		padding: 8px;
		font-size: 14px;
		border: 1px solid ${(props) => (props.$isDark ? "#555" : "#ccc")};
		border-radius: 4px;
		outline: none;
		background: ${(props) => (props.$isDark ? "#333" : "#fff")};
		color: ${(props) => (props.$isDark ? "#fff" : "#000")};
		transition: border-color 0.3s ease, background 0.3s ease;
		${(props) =>
		props.$isReadOnly &&
		`
			cursor: not-allowed;
			background: ${props.$isDark ? "#222" : "#eee"};
			border: 1px solid ${props.$isDark ? "#444" : "#ccc"};
		`}
	}

	.custom-link-input:focus {
		border-color: ${(props) => (props.$isDark ? "#66b2ff" : "#007bff")};
		background: ${(props) => (props.$isDark ? "#444" : "#fff")};
	}

	.custom-link-preview {
		display: flex;
		align-items: center;
		gap: 12px;
		border-radius: 5px;
		overflow: hidden;
		background: ${(props) => (props.$isDark ? "#333" : "#fff")};
		transition: all 0.3s ease;
		border: 1px solid ${(props) => (props.$isDark ? "#555" : "#e1e1e1")};
	}

	.custom-link-wrapper {
		display: flex;
		text-decoration: none;
		width: 100%;
		color: inherit;
		transition: all 0.3s ease;
	}

	.custom-link-wrapper:hover {
		background: ${(props) => (props.$isDark ? "#444" : "#f1f1f1")};
	}

	.custom-link-image {
		width: 100px;
		height: 100px;
		object-fit: cover;
		border-right: 1px solid ${(props) => (props.$isDark ? "#555" : "#ddd")};
	}

	.custom-link-text {
		flex: 1;
		padding: 8px;
		display: flex;
		flex-direction: column;
	}

	.custom-link-title {
		font-size: 14px;
		font-weight: bold;
		color: ${(props) => (props.$isDark ? "#fff" : "#333")};
		margin: 0;
		line-height: 1.3;
	}

	.custom-link-description {
		font-size: 14px;
		color: ${(props) => (props.$isDark ? "#aaa" : "#666")};
		margin: 4px 0 0;
		line-height: 1.4;
	}

	.custom-embed-wrapper {
		margin: 16px 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.custom-embed-wrapper input {
    width: 100%;
    max-width: 600px;
    font-size: 14px;
    padding: 10px;
    border: 1px solid ${(props) => (props.$isDark ? '#555' : '#ccc')};
    border-radius: 6px;
    margin-bottom: 12px;
    background-color: ${(props) => (props.$isDark ? '#222' : '#fff')};
    color: ${(props) => (props.$isDark ? '#fff' : '#000')};
    transition: all 0.3s ease;
  }

	.custom-embed-wrapper input:focus {
    border-color: ${(props) => (props.$isDark ? '#888' : '#007bff')};
    outline: none;
  }

  .custom-embed-wrapper iframe {
    width: 100%;
    max-width: 900px;
    aspect-ratio: 16 / 9; 
		height: auto; 
    border: none;
    border-radius: 10px;
    box-shadow: ${(props) =>
      props.$isDark
        ? '0 2px 10px rgba(255, 255, 255, 0.1)'
        : '0 2px 10px rgba(0, 0, 0, 0.1)'};
    background-color: ${(props) => (props.$isDark ? '#111' : '#fff')};
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
  const isPublished = postState === 'published';
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
      if (editorRef.current || !parsedInitialData) return;

      const [
        { default: EditorJS },
        { default: CodeTool },
        { default: Header },
        { default: List },
        { default: Warning },
        { default: Marker },
        { default: Table },
        { default: Delimiter },
        { default: RawTool },
        { default: ImageTool },
        { default: AttachesTool },
      ] = await Promise.all([
        import('@editorjs/editorjs'),
        import('@editorjs/code'),
        import('@editorjs/header'),
        import('@editorjs/list'),
        import('@editorjs/warning'),
        import('@editorjs/marker'),
        import('@editorjs/table'),
        import('@editorjs/delimiter'),
        import('@editorjs/raw'),
        import('@editorjs/image'),
        import('@editorjs/attaches'),
      ]);

      const CustomHeader = (await import('./CustomHeader')).default;
      const DeleteImageTune = (await import('./DeleteImageTune')).default;
      const CustomLinkTool = (await import('./CustomLinkTool')).default;
      const CustomEmbedTool = (await import('./CustomEmbedTool')).default;
      const CustomAttachesUploader = (await import('./CustomAttachesUploader')).default;

      editorRef.current = new EditorJS({
        holder: 'editorjs',
        readOnly: isReadOnly,
        placeholder: 'Hello world!',
        data: parsedInitialData,
        autofocus: false,
        tools: {
			raw: { class: RawTool, shortcut: 'OPTION+R' },
			code: { class: CodeTool, shortcut: 'OPTION+C' },
			list: { class: List as unknown as BlockToolConstructable, inlineToolbar: true, shortcut: 'OPTION+L' },
			delimiter: { class: Delimiter as unknown as BlockToolConstructable, shortcut: 'OPTION+D' },
			customEmbed: {
				class: CustomEmbedTool,
				shortcut: 'OPTION+Y',
				toolbox: CustomEmbedTool.toolbox,
			},
			Marker: { class: Marker, shortcut: 'OPTION+M' },
			customHeader: { class: CustomHeader, shortcut: 'OPTION+N' },
			warning: { class: Warning, inlineToolbar: true, shortcut: 'OPTION+W', config: { titlePlaceholder: 'Title', messagePlaceholder: 'Message', }, },
			image: {
				class: ImageTool,
				config: {
				uploader: {
					async uploadByFile(file: File) {
					const res = await uploadThumbnail(file);
					return { success: 1, file: { url: res.fileUrl } };
					},
				},
				},
			},
			deleteImage: {
				class: DeleteImageTune,
			},
			customLink: {
				class: CustomLinkTool, shortcut: 'OPTION+Q',
				config: {
					readOnly: false,
				},
			},
			table: {
				class: Table as unknown as BlockToolConstructable, shortcut: 'OPTION+T',
				inlineToolbar: true,
				config: { rows: 2, cols: 3, maxRows: 5, maxCols: 5, },
			},
			attaches: {
				class: AttachesTool, shortcut: 'OPTION+A',
				config: { uploader: CustomAttachesUploader }
			},
			header: {
				class: Header as unknown as BlockToolConstructable, shortcut: 'OPTION+H',
				config: { levels: [1, 2, 3, 4, 5], defaultLevel: 2, placeholder: 'Write a header', },
				sanitize: {
					level: true,
				},
			},
        },
        tunes: ['deleteImage'],
        onReady: () => {
          if (isReadOnly) renderHighlightedCode();
        },
        onChange: async () => {
          if (editorRef.current && onSave) {
            const content = await editorRef.current.save();
            onSave(content);
          }
        },
      });
    };

    initEditor();
    return () => editorRef.current?.destroy();
  }, [parsedInitialData, isReadOnly]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.readOnly?.toggle(isReadOnly);
      if (isReadOnly) renderHighlightedCode();
    }
  }, [isReadOnly]);

  const handlePublish = async () => {
    setModalMessage('해당글을 게시하시겠습니까?');
    openModal();
  };

  const handleUnPublish = async () => {
    setModalMessage('게시를 취소하겠습니까?');
    openModal();
  };

  const onConfirmPublish = async () => {
    if (isPublished) await unPublishBlog(blogId);
    else await publishBlog(blogId);
    window.location.href = '/';
  };

  return (
    <EditorContainer $isReadOnly={isReadOnly} $maxwidth={editorMaxWidth} $isDark={isDarkMode}>
      <StyledEditor id="editorjs" />
      <ModalPortal>
        <ConfirmModal message={modalMessage} onClose={closeModal} onCancel={() => {}} onConfirm={onConfirmPublish} />
      </ModalPortal>
      <BlogActionWrapper>
        {!isReadOnly && <Thumbnail editorMaxWidth={editorMaxWidth} imageUrl={imageUrl} setImageUrl={setImageUrl} />}
        <ButtonWrapper>
          {!isReadOnly && <Button onClick={() => editorRef.current?.save().then(onSave)} color={palette.blue} width="100px">Save</Button>}
          {!isReadOnly && !isPublished && <Button onClick={handlePublish} color={palette.green} width="100px">Publish</Button>}
          {!isReadOnly && isPublished && <Button onClick={handleUnPublish} color={palette.darkRed} width="100px">unPublish</Button>}
        </ButtonWrapper>
      </BlogActionWrapper>
    </EditorContainer>
  );
};

export default Editor;
