"use client";

import { getTagsAll, getTagsByBlogId, Post, TagOption } from "@/app/api/blogApi";
import WidthSlider from "@/app/components/common/WidthSlder";
import Title from "@/app/components/editor/Title";
import Header from "@/app/components/header/Header";
import SideBar from "@/app/components/sidebar/Sidebar";
import Editor from "@/app/editor/Editor";
import { useSelector } from "@/app/store";
import { useEffect, useState } from "react";
import { ActionMeta, MultiValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import styled from "styled-components";

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
`;

const TagsWrapper = styled.div<{ width: string }>`
	display: columns;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
	max-width: ${(props) => props.width};
	padding-bottom: 10px;
`;


interface BlogDetailProps {
	post: Post;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ post }) => {
	const [editorMaxWidth, setEditorMaxWidth] = useState<string>('650px');
	const isDarkMode = useSelector((state) => state.common.isDark);
	const [availableTags, setAvailableTags] = useState<TagOption[]>();
	const [selectedTags, setSelectedTags] = useState<TagOption[]>();
	const [isReadOnly, setIsReadOnly] = useState(false);
	const [title, setTitle] = useState('');

	const handleWidthChage = (width: number) => {
		setEditorMaxWidth(`${width}px`);
	}

	const handleSave = () => {
	}


	useEffect(() => {
		setTitle(post.title);

		const tagsAll = async () => {
			try {
				const availableTags = await getTagsAll();
				setAvailableTags(availableTags);
				console.log(availableTags);
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


	const handleTagChange = (newValue: MultiValue<TagOption>, actionMeta: ActionMeta<TagOption>) => {
		switch (actionMeta.action) {
			case "select-option": {
				console.log("Tag selected:", newValue);
				setSelectedTags(newValue as TagOption[]);
				setAvailableTags((prev) =>
					prev?.filter((tag) => !(newValue as TagOption[]).some((selectedTag) => selectedTag.name === tag.name))
				);
				break;
			}
			case "remove-value": {
				console.log("New value from react-select (newValue):", actionMeta.removedValue);
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
				console.log("All tags cleared");
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
			<Editor initialData={post?.content} editorMaxWidth={editorMaxWidth} onSave={handleSave} isReadOnly={isReadOnly} />
			<SliderWrapper>
				<WidthSlider defaultWidth={650} onWidthChange={handleWidthChage} />
			</SliderWrapper>
		</Container>
	);
};

export default BlogDetail;
