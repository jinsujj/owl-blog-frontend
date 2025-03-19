"use client";

import { getBlogSummary, PostSummary } from "@/app/api/blogApi";
import { useSelector } from "@/app/store";
import styled from "styled-components";
import { TagList } from "./TagList";
import VisitorBox from "./VisitorBox";
import { SearchBox } from "./SearchBox";
import { useEffect, useState } from "react";
import { HiBars3 } from "react-icons/hi2";
import { commonAction } from "@/app/store/common";
import { useDispatch } from "react-redux";

interface SideBarStyledProps {
	$isDark: boolean;
	$isSidebarOpen: boolean;
}

const SideBarContainer = styled.div<SideBarStyledProps>`
	position: fixed;
	top: 0%;
	left: ${(props) => (props.$isSidebarOpen ? "0" : "-240px")};
	width: 230px;
	height: 100%; 
	background-color: ${(props) => (props.$isDark ? "#444" : "#f9f9f9")};
	border-right: 1px solid ${(props) => (props.$isDark ? "#555" : "#ddd")};
	overflow-y: auto;
	transition: left 0.3s ease;
	z-index: 5;
	padding: 20px;
	align-items: center;
	justify-content: center;
`;

const SidebarToggleIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`;


export const SideBar = () => {
	const dispatch = useDispatch();
	const isSidebarOpen = useSelector((state) => state.common.toggle);
	const toggle = useSelector((state) => state.common.toggle);
	const [postSummary, setPostSummary] = useState<PostSummary[]>([]);
	const isDarkMode = useSelector((state) => state.common.isDark);
	const [isDark, setIsDark] = useState<boolean>(false);
  
	useEffect(() => {
		  setIsDark(isDarkMode);
	}, [isDarkMode]);

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

	const setToggle = (toggle: boolean) => {
		dispatch(commonAction.setToggle(!toggle));
	  }

	
	return (
		<SideBarContainer $isDark={isDark} $isSidebarOpen={isSidebarOpen}>
			<SidebarToggleIcon onClick={() => setToggle(toggle)}>
				{toggle ? <HiBars3 /> : <HiBars3 />}
			</SidebarToggleIcon>
			<SearchBox />
			<TagList posts={postSummary} />
			<VisitorBox />
		</SideBarContainer>
	)
}

export default SideBar;