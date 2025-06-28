"use client";

import dynamic from "next/dynamic";
import { getTagsAll, getTagsByBlogId, Post, TagOption, updateBlog } from "@/app/api/blogApi";
import WidthSlider from "@/app/components/common/WidthSlder";
import Title from "@/app/components/editor/Title";
import Header from "@/app/components/header/Header";
import SideBar from "@/app/components/sidebar/Sidebar";
import Editor from "@/app/editor/Editor";
import useModal from "@/app/hooks/useModal";
import { useSelector } from "@/app/store";
import { commonAction } from "@/app/store/common";
import { OutputData } from "@editorjs/editorjs";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ActionMeta, MultiValue } from "react-select";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import palette from "@/app/styles/palette";
import MessageModal from "@/app/components/modal/MessageModal";
import useUtterances from "@/app/hooks/useUtterances";
import { authAction } from "@/app/store/auth";
import { checkTokenValidity, getKakaoUserInfo } from "@/app/api/loginApi";
import { summaryBlog } from "@/app/api/aiApi";
import { useAutoSave } from '@/app/hooks/useAutoSave';

interface StyledProps {
	$isDark: boolean;
}

const Container = styled.div<StyledProps>`
	min-height: 100vh;
	margin: 0 auto;
	background-color: ${(props) => (props.$isDark ? "#333" : "#fff")};
	color: ${(props) => (props.$isDark ? "#ddd" : "#333")};

	.css-1nmdiq5-menu { 
  		z-index: 100 !important; // tags priorities
	}

	.css-1cfo1cf {
		color:  ${(props) => (props.$isDark ? "#ddd" : "#333")};
	}
`;

const SliderWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 100px;
	z-index: 1000;

	@media (max-width: 768px) {
    display: none;
  }
`;

const TagsWrapper = styled.div<{ width: string }>`
	display: columns;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
	max-width: ${(props) => props.width};
	padding-bottom: 10px;
`;

const Utterances = styled.div`
	margin-top: 20px;
`;

const CreatableSelect = dynamic(() => import('react-select/creatable'), { ssr: false }) as typeof import('react-select/creatable').default;


interface BlogDetailProps {
	post: Post;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ post }) => {
	// modal 
	const { openModal, closeModal, ModalPortal } = useModal();
	const [modalMessage, setModalMessage] = useState('');
	const [alertColor, setAlertColor] = useState('');


	// state 
	const [editorMaxWidth, setEditorMaxWidth] = useState<string>('650px');
	const [isReadOnly, setIsReadOnly] = useState(false);
	const isLogged = useSelector((state) => state.auth.isLogged);
	const isDarkMode = useSelector((state) => state.common.isDark);
	const userId = useSelector((state) => state.auth.id);
	const dispatch = useDispatch();
	const router = useRouter();

	// blog 
	const [title, setTitle] = useState('');
	const [editorData, setEditordata] = useState<OutputData>();
	const [availableTags, setAvailableTags] = useState<TagOption[]>();
	const [selectedTags, setSelectedTags] = useState<TagOption[]>();
	const [imageUrl, setImageUrl] = useState<string>('');
	useUtterances(post.id.toString());

	// 초기 로드 여부를 추적
	const [isInitialized, setIsInitialized] = useState(false);

	// 자동 저장 훅 사용
	const {
		setEditorReady,
		setEditorRef,
		setTypingState,
		clearLocalStorage,
		loadFromLocalStorage
	} = useAutoSave({
		blogId: post.id,
		title,
		imageUrl,
		selectedTags: selectedTags || [],
		onRestore: undefined // 복원 로직은 직접 처리
	});

	const handleWidthChage = (width: number) => {
		setEditorMaxWidth(`${width}px`);
	}

	const handleSave = async (data: OutputData) => {
		setEditordata(data);
		const content = JSON.stringify(data);

		if (title.length == 0) {
			setAlertColor(palette.red);
			setModalMessage("제목이 비어있습니다.");
			openModal();
			return;
		}
		if (data.blocks.length == 0) {
			setAlertColor(palette.red);
			setModalMessage("내용이 비어있습니다.");
			openModal();
			return;
		}
		try {
			const result = await updateBlog(post.id, userId, title, content, imageUrl, selectedTags);
			setAlertColor(palette.green);
			setModalMessage("Blog update successfully! " + result.id);
			openModal();
			clearLocalStorage(); // 저장 성공 시 로컬 스토리지 클리어
			handlepost();
		}
		catch (error) {
			setAlertColor(palette.red);
			setModalMessage("Failed to update blog. Please try again. " + error);
			openModal();
		}
	}

	const handlepost = () => {
		setTimeout(() => {
			router.push('/');
		}, 1000);
	}

	// login token 
	useEffect(() => {
		checkTokenValidity().then((validToken) => {
			if (!validToken) return;
			dispatch(authAction.setLogged(true));
		});
		return;
	}, [router]);

	// userinfo
	useEffect(() => {
		if (isLogged)
			setUserInfo();
	}, [isLogged]);

	const setUserInfo = useCallback(async () => {
		try {
			const userInfo = await getKakaoUserInfo();
			dispatch(authAction.setUserId(userInfo?.id || ''));
			dispatch(authAction.setUserName(userInfo?.userName || ''));
			dispatch(authAction.setImageUrl(userInfo?.imageUrl || ''));
			dispatch(authAction.setEmail(userInfo?.email || ''));
		} catch (error) {
			console.error("Error setting userInfo:", error);
		}
	}, [dispatch]);

	// dynamic size effect
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 768) {
				dispatch(commonAction.setToggle(false));
			} else {
				dispatch(commonAction.setToggle(true));
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [dispatch]);

	// dark mode 
	useEffect(() => {
		const now = new Date();
		const utcNow = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
		const koreanTimeDiff = 9 * 60 * 60 * 1000;
		const koreaNow = new Date(utcNow + koreanTimeDiff);
		if (18 <= koreaNow.getHours() || koreaNow.getHours() <= 6)
			dispatch(commonAction.setDarkMode(true));
		else
			dispatch(commonAction.setDarkMode(false));
	}, [dispatch])

	// 초기화 로직
	useEffect(() => {
		if (isInitialized) return; // 이미 초기화되었으면 스킵

		dispatch(commonAction.setPostId(post?.id || 0));
		if (post?.publishedAt) {
			dispatch(commonAction.setPostState("published"));
		} else if (post?.updatedAt) {
			dispatch(commonAction.setPostState("modify"));
		} else {
			dispatch(commonAction.setPostState("created"));
		}

		// 1. 먼저 서버 데이터로 초기화
		setTitle(post.title);
		setEditordata(post.content);
		setImageUrl(post.thumbnailUrl);

		// 2. 로컬 스토리지에서 draft 데이터 확인
		const savedData = loadFromLocalStorage();
		if (savedData) {
			console.log('Found draft data, restoring...');
			// draft 데이터가 있으면 덮어쓰기
			if (savedData.title) setTitle(savedData.title);
			if (savedData.data) setEditordata(savedData.data);
			if (savedData.imageUrl) setImageUrl(savedData.imageUrl);
			if (savedData.selectedTags) setSelectedTags(savedData.selectedTags);
		}

		const tagsAll = async () => {
			try {
				const availableTags = await getTagsAll();
				setAvailableTags(availableTags);
			}
			catch (error) {
				console.error("Failed to fetch tags: " + error);
			}
		}

		const fetchBlogTags = async () => {
			try {
				const selectedTags = await getTagsByBlogId(post.id.toString());
				// 로컬 스토리지에 태그가 없을 때만 서버 태그 사용
				if (!savedData?.selectedTags) {
					setSelectedTags(selectedTags);
				}
			}
			catch (error) {
				console.error("Failed to fetch post tags:", error);
			}
		};
		
		tagsAll();
		fetchBlogTags();
		
		setIsInitialized(true);
	}, [post.id, dispatch, loadFromLocalStorage, isInitialized]);

	useEffect(() => {
		if (!isLogged || (userId !== post.author))
			setIsReadOnly(true);
		if (userId === post.author)
			setIsReadOnly(false);
	}, [isLogged]);

	const handleAISummaryClick = () => {
		setModalMessage("AI 요약이 요청되었습니다.");
		setAlertColor(palette.blue); 
		openModal(); 
		summaryBlog(post.id);
	};
	


	const handleTagChange = (newValue: MultiValue<TagOption>, actionMeta: ActionMeta<TagOption>) => {
		switch (actionMeta.action) {
			case "select-option": {
				setSelectedTags(newValue as TagOption[]);
				setAvailableTags((prev) =>
					prev?.filter((tag) => !(newValue as TagOption[]).some((selectedTag) => selectedTag.name === tag.name))
				);
				break;
			}
			case "remove-value": {
				setSelectedTags((prev) => prev?.filter((tag) => tag.name !== actionMeta.removedValue?.name));
				setAvailableTags((prev) => {
					const removedTag = actionMeta.removedValue;
					if (removedTag) {
						return [...(prev || []), removedTag];
					}
					return prev;
				});
				break;
			}
			case "clear": {
				setSelectedTags([]);
				setAvailableTags((prev) => [...(prev || []), ...(selectedTags || [])]);
				break;
			}
		}
	};

	const handleCreateTag = (inputValue: string) => {
		const newTag: TagOption = { name: inputValue, label: inputValue };

		setAvailableTags((prev) => [...(prev || []), newTag]);
		setSelectedTags((prev) => [...(prev || []), newTag]);
	};

	return (
		<Container $isDark={isDarkMode}>
			<Header />
			<ModalPortal>
				<MessageModal message={modalMessage} onClose={closeModal} color={alertColor} />
			</ModalPortal>
			<SideBar />
			<TagsWrapper width={editorMaxWidth}>
				<Title editorMaxWidth={editorMaxWidth} title={title} setTitle={setTitle} isReadOnly={isReadOnly} setIsReadOnly={setIsReadOnly} onAISummary={handleAISummaryClick} />
				<CreatableSelect
					isMulti
					isDisabled={isReadOnly}
					value={selectedTags}
					onChange={(newValue, actionMeta) => handleTagChange(newValue as MultiValue<TagOption>, actionMeta as ActionMeta<TagOption>)}
					onCreateOption={handleCreateTag}
					options={availableTags}
					getOptionValue={(option) => option.name}
					getOptionLabel={(option) => option.label}
					placeholder="Select or create tags..."
					isClearable
					menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
					styles={{
						control: (baseStyles) => ({
							...baseStyles,
							backgroundColor: isDarkMode ? "#333" : "#fff",
							borderColor: isDarkMode ? "#555" : "#ccc",
							color: isDarkMode ? "#ddd" : "#333",
						}),
						menu: (baseStyles) => ({
							...baseStyles,
							backgroundColor: isDarkMode ? "#444" : "#fff",
							color: isDarkMode ? "#ddd" : "#333",
						}),
						option: (baseStyles, { isFocused }) => ({
							...baseStyles,
							backgroundColor: isFocused
								? isDarkMode
									? "#555"
									: "#eee"
								: isDarkMode
									? "#444"
									: "#fff",
							color: isDarkMode ? "#ddd" : "#333",
						}),
						singleValue: (baseStyles) => ({
							...baseStyles,
							color: isDarkMode ? "#ddd" : "#333",
						}),
						multiValue: (baseStyles) => ({
							...baseStyles,
							backgroundColor: isDarkMode ? "#555" : "#eee",
						}),
						multiValueLabel: (baseStyles) => ({
							...baseStyles,
							color: isDarkMode ? "#ddd" : "#333",
							paddingRight: isReadOnly ? "8px" : "1pxC",
						}),
						multiValueRemove: (baseStyles) => ({
							...baseStyles,
							display: isReadOnly ? "none" : "flex",
						})
					}}
				/>
			</TagsWrapper>
			<Editor 
				initialData={editorData} 
				editorMaxWidth={editorMaxWidth} 
				onSave={handleSave} 
				isReadOnly={isReadOnly} 
				imageUrl={imageUrl} 
				setImageUrl={setImageUrl}
				onEditorReady={setEditorReady}
				onEditorRef={setEditorRef}
				onTypingStateChange={setTypingState}
			/>
			<Utterances id={post.id.toString()} />
			<SliderWrapper>
				<WidthSlider defaultWidth={650} onWidthChange={handleWidthChage} />
			</SliderWrapper>
		</Container>
	);
};

export default BlogDetail;
