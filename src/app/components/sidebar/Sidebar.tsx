import { getBlogSummary, PostSummary } from "@/app/api/blogApi";
import { useSelector } from "@/app/store";
import styled from "styled-components";
import { TagList } from "./TagList";
import VisitorBox from "./VisitorBox";
import { SearchBox } from "./SearchBox";
import { useEffect, useState } from "react";

interface SideBarStyledProps {
  $isDark: boolean;
  $isSidebarOpen: boolean; 
}

const SideBarContainer = styled.div<SideBarStyledProps>`
	position: fixed;
	left: ${(props) => (props.$isSidebarOpen ? "0" : "-240px")};
	width: 230px;
	height: 100%; 
	background-color: ${(props) => (props.$isDark ? "#444": "#f9f9f9")};
	border-right: 1px solid ${(props) => (props.$isDark ? "#555"  : "#ddd")};
	overflow-y: auto;
	transition: left 0.3s ease;
	z-index: 5;
	padding: 20px;
	align-items: center;
	justify-content: center;
`;


export const SideBar= () => {
	const isDarkMode = useSelector((state) => state.common.isDark);
	const isSidebarOpen = useSelector((state) => state.common.toggle);
	const [postSummary, setPostSummary] = useState<PostSummary[]>([]);

	useEffect(() => {
			const fetchPosts = async () => {
				try {
					const posts = await getBlogSummary();
					setPostSummary(posts);
				} catch (error) {
					console.error("Failed to fetch posts:", error);
				}
			};
		
			fetchPosts();
		}, []);

	return (
		<SideBarContainer $isDark={isDarkMode} $isSidebarOpen={isSidebarOpen}>
			<SearchBox/>
			<TagList posts={postSummary}/>
			<VisitorBox/>
		</SideBarContainer>
	)
}

export default SideBar;