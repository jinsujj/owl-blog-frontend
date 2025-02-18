"use client";

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
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ActionMeta, MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import palette from "@/app/styles/palette";
import MessageModal from "@/app/components/modal/MessageModal";
import useUtterances from "@/app/hooks/useUtterances";

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


interface BlogDetailProps {
	post: Post;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ post }) => {
	// modal 
	const {openModal, closeModal, ModalPortal} = useModal();
	const [modalMessage, setModalMessage] = useState('');
	const [alertColor, setAlertColor] = useState('');

	// state 
	const [editorMaxWidth, setEditorMaxWidth] = useState<string>('650px');
	const [isReadOnly, setIsReadOnly] = useState(false);
	const isLogged = useSelector((state) => state.auth.isLogged);
	const isDarkMode = useSelector((state) => state.common.isDark);
	const userId = useSelector((state) => state.auth.id);
	const dispatch = useDispatch();
	const router= useRouter();

	// blog 
	const [title, setTitle] = useState('');
	const [editorData, setEditordata] = useState<OutputData>();
	const [availableTags, setAvailableTags] = useState<TagOption[]>();
	const [selectedTags, setSelectedTags] = useState<TagOption[]>();
	const [imageUrl, setImageUrl] = useState<string>('');
	useUtterances(post.id.toString());

	const handleWidthChage = (width: number) => {
		setEditorMaxWidth(`${width}px`);
	}

	const handleSave = async (data : OutputData) => {
		setEditordata(data);
		const content = JSON.stringify(data);

		if(title.length == 0){
			setAlertColor(palette.red);
			setModalMessage("제목이 비어있습니다.");
			openModal();
			return;
		}
		if(data.blocks.length == 0){
			setAlertColor(palette.red);
			setModalMessage("내용이 비어있습니다.");
			openModal();
			return;
		}
		try{
			const result = await updateBlog(post.id, userId, title, content, imageUrl, selectedTags);
			setAlertColor(palette.green);
			setModalMessage("Blog update successfully! "+ result.id);
			openModal();
			hadlepost();
		}
		catch(error){
			setAlertColor(palette.red);
			setModalMessage("Failed to update blog. Please try again. "+ error);
			openModal();
		}
	}

	const hadlepost = () => {
		setTimeout(() => {
      router.push('/');
    }, 1000); 
	}


	useEffect(() => {
		dispatch(commonAction.setPostId(post?.id || 0));
		if (post?.publishedAt) {
			dispatch(commonAction.setPostState("published"));
		} else if (post?.updatedAt) {
			dispatch(commonAction.setPostState("modify"));
		} else {
			dispatch(commonAction.setPostState("created"));
		}

		setTitle(post.title);
		setEditordata(post.content);
		setImageUrl(post.thumbnailUrl);

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
				setSelectedTags(selectedTags);
			}
			catch (error) {
				console.error("Failed to fetch post tags:", error);
			}
		};
		tagsAll();
		fetchBlogTags();
	}, [post.id]);

	useEffect(() => {
		if(!isLogged || (userId !== post.author))
			setIsReadOnly(true);
		if (userId === post.author)
			setIsReadOnly(false);
	},[isLogged]);



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
				<MessageModal message={modalMessage} onClose={closeModal} color={alertColor}/>
			</ModalPortal>
			<SideBar />
			<TagsWrapper width={editorMaxWidth}>
				<Title editorMaxWidth={editorMaxWidth} title={title} setTitle={setTitle} isReadOnly={isReadOnly} setIsReadOnly={setIsReadOnly} />
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
			<Editor initialData={editorData} editorMaxWidth={editorMaxWidth} onSave={handleSave} isReadOnly={isReadOnly} imageUrl={imageUrl} setImageUrl={setImageUrl}/>
			<Utterances id={post.id.toString()}/>
			<SliderWrapper>
				<WidthSlider defaultWidth={650} onWidthChange={handleWidthChage} />
			</SliderWrapper>
		</Container>
	);
};

export default BlogDetail;
