'use client';

import React, { useState, useCallback } from "react";
import palette from "../styles/palette";
import WidthSlider from "../components/common/WidthSlder";
import styled from "styled-components";
import { createBlog } from "../api/blogApi";
import dynamic from "next/dynamic";
import useModal from "../hooks/useModal";
import MessageModal from "../components/modal/MessageModal";
import Header from "../components/header/Header";
import { useSelector } from "../store";
import SideBar from "../components/sidebar/Sidebar";
import { ActionMeta, MultiValue } from "react-select";
import Title from "../components/editor/Title";
import { OutputData } from "@editorjs/editorjs";
import { useEffect } from 'react';
import { getTagsAll, TagOption } from "@/app/api/blogApi";
import { NotAuthrizedPage } from "./NotAuthrizedPage";
import { useAutoSave, DraftData } from '../hooks/useAutoSave';


interface StyledProps {
	$isDark: boolean;
}

const Container = styled.div<StyledProps>`
	min-height: 100vh;
	margin: 0 auto;
	background-color: ${(props) => (props.$isDark ? "#333" : "#fff")};
	color: ${(props) => (props.$isDark ? "#ddd" : "#333")};

	// tags priorities
	.css-1nmdiq5-menu {
  	z-index: 100 !important;
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

const Editor = dynamic(() => import("./Editor"), { ssr: false });
const CreatableSelect = dynamic(() => import('react-select/creatable'), { ssr: false }) as typeof import('react-select/creatable').default;

const EditorPage: React.FC = () => {
	// modal 
	const { openModal, closeModal, ModalPortal } = useModal();
	const [modalMessage, setModalMessage] = useState('');
	const [alertColor, setAlertColor] = useState('');

	// state 
	const [editorMaxWidth, setEditorMaxWidth] = useState<string>('650px');
	const [isReadOnly, setIsReadOnly] = useState(false);
	const isDarkMode = useSelector((state) => state.common.isDark);
	const isLogged = useSelector((state) => state.auth.isLogged);
	const userId = useSelector((state) => state.auth.id);

	// blog
	const [editorData, setEditorData] = useState<OutputData>({ version: undefined, time: undefined, blocks: [] });
	const [title, setTitle] = useState('');
	const [availableTags, setAvailableTags] = useState<TagOption[]>([]);
	const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
	const [imageUrl, setImageUrl] = useState<string>('');

	// onRestore 콜백을 useCallback으로 메모이제이션
	const handleRestore = useCallback((savedData: DraftData) => {
		if (savedData.title) setTitle(savedData.title);
		if (savedData.data) setEditorData(savedData.data);
		if (savedData.imageUrl) setImageUrl(savedData.imageUrl);
		if (savedData.selectedTags) setSelectedTags(savedData.selectedTags);
	}, []);

	// 자동 저장 훅 사용
	const {
		setEditorReady,
		setEditorRef,
		setTypingState,
		clearLocalStorage
	} = useAutoSave({
		blogId: 0, // 새 글은 0으로 설정
		title,
		imageUrl,
		selectedTags: selectedTags || [],
		onRestore: handleRestore
	});

	const handleSave = async (data: OutputData) => {
		setEditorData(data);
		const content = JSON.stringify(data);

		if(title.length == 0){
			setModalMessage("제목이 비어있습니다.");
			setAlertColor(palette.red);
			openModal();
			return;
		}
		if(data.blocks.length == 0){
			setModalMessage("내용이 비어있습니다.");
			setAlertColor(palette.red);
			openModal();
			return;
		}

		try {
			const result = await createBlog(userId, title, content, imageUrl, selectedTags || []);
			setModalMessage("Blog created successfully! "+ result.id);
			setAlertColor(palette.green);
			openModal();
			clearLocalStorage(); // 저장 성공 시 로컬 스토리지 클리어
			window.location.href = '/';
		}
		catch (error) {
			setModalMessage("Failed to create blog. Please try again. "+ error);
			setAlertColor(palette.red);
			openModal();
		}
	}

	const handleWidthChage = (width: number) => {
		setEditorMaxWidth(`${width}px`);
	}


	const handleCreateTag = (inputValue: string) => {
		const newTag: TagOption = { name: inputValue, label: inputValue };
		setAvailableTags((prev) => [...(prev || []) ,newTag]);
		setSelectedTags((prev) => [...(prev || []), newTag]);
	};

	useEffect(() => {
		const tagsAll = async () => {
			try {
				const tags = await getTagsAll()||[];
				setAvailableTags((prev) => {
					const newTags = tags.filter(
						(tag) => !prev.some((existingTag) => existingTag.name === tag.name)
					);
					return [...prev, ...newTags];
				});
			}
			catch (error) {
				console.error("Failed to fetch tags: " + error);
			}
		}
		tagsAll();
	},[]);


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

	if(!isLogged){
		return <NotAuthrizedPage/>
	}

	return (
		<Container $isDark={isDarkMode}>
			<Header />
			<ModalPortal>
				<MessageModal message={modalMessage} onClose={closeModal} color={alertColor} />
			</ModalPortal>
			<SideBar/>
			<TagsWrapper width={editorMaxWidth}>
				<Title editorMaxWidth={editorMaxWidth} title={title} setTitle={setTitle} isReadOnly={isReadOnly} setIsReadOnly={setIsReadOnly} />
				<CreatableSelect
					isMulti
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
						}),
					}}
				/>
			</TagsWrapper>
			<Editor initialData={editorData} editorMaxWidth={editorMaxWidth} onSave={handleSave} isReadOnly={isReadOnly} imageUrl={imageUrl} setImageUrl={setImageUrl} onEditorReady={setEditorReady} onEditorRef={setEditorRef} onTypingStateChange={setTypingState}/>
			<SliderWrapper>
				<WidthSlider defaultWidth={650} onWidthChange={handleWidthChage} />
			</SliderWrapper>
		</Container>
	);
};

export default EditorPage;