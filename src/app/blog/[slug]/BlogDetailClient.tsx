"use client";

import { getTagsByBlogId, Post, TagOption } from "@/app/api/blogApi";
import WidthSlider from "@/app/components/common/WidthSlder";
import Title from "@/app/components/editor/Title";
import Header from "@/app/components/header/Header";
import SideBar from "@/app/components/sidebar/Sidebar";
import Editor from "@/app/editor/Editor";
import { useSelector } from "@/app/store";
import { useEffect, useState } from "react";
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


interface BlogDetailClientProps {
  post: Post;
}

const BlogDetailClient: React.FC<BlogDetailClientProps> = ({ post }) => {
	const [editorMaxWidth, setEditorMaxWidth] = useState<string>('650px');
	const isDarkMode = useSelector((state) => state.common.isDark);
	const [selectedTags, setSelectedTags] = useState<TagOption[]>();

	const handleWidthChage = (width: number) => {
		setEditorMaxWidth(`${width}px`);
	}

	const handleSave =() => {
		console.log("nothingwork");
	}

	const setTitle = () => {
		console.log("nothing work");
	}

	const setIsReadOnly = () => {
		console.log("nothing work");
	}

	useEffect(() => {
		const fetchBlogTags = async() => {
			try{
				const selectedTags = await getTagsByBlogId(post.id.toString());
				setSelectedTags(selectedTags);
			}
			catch(error){
				console.error("Failed to fetch post tags:", error);	
			}
		};

		fetchBlogTags();
	},[post.id])
		
  return (
    <Container $isDark={isDarkMode}>
			<Header />
			<SideBar/>
			<TagsWrapper width={editorMaxWidth}>
				<Title editorMaxWidth={editorMaxWidth} title={post.title} setTitle={setTitle} isReadOnly={true} setIsReadOnly={setIsReadOnly} />
				<CreatableSelect
									isMulti
									isDisabled={true}
									value={selectedTags}
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
			<Editor initialData={post?.content} editorMaxWidth={editorMaxWidth} onSave={handleSave} isReadOnly={true} />
			<SliderWrapper>
				<WidthSlider defaultWidth={650} onWidthChange={handleWidthChage} />
			</SliderWrapper>
		</Container>
  );
};

export default BlogDetailClient;
