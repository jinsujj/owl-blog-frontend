"use client";

import { PostSummary } from "@/app/api/blogApi";
import { useSelector } from "@/app/store";
import { commonAction } from "@/app/store/common";
import palette from "@/app/styles/palette";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useRouter } from "next/navigation";

interface StyledProps {
	$isDark: boolean;
}

const TagWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Divider = styled.div<StyledProps>`
	align-self: center;
	display: flex;
  width: 80%;
  height: 1px;
  background-color: ${(props) => (props.$isDark ? "#555" : "#ddd")};
`;


const TagListContainer = styled.ul`
	list-style: none;
	padding: 10px 0px;
`;

const H3 = styled.h3`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 22px;
`;

const TagItem = styled.li<StyledProps>`
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.$isDark ? "#fff" : "#333")};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    color: ${(props) => (props.$isDark ? "#ffcc00" : "#007bff")};
    text-decoration: underline;
    cursor: pointer;
  };

  span {
    color: ${palette.green};
    margin-left: 5px;
  };
`;


interface TagListProps {
	posts: PostSummary[];
}

export const TagList = ({ posts }: TagListProps) => {
	const dispatch = useDispatch();
	const isDarkMode = useSelector((state) => state.common.isDark);
	const router= useRouter();

	const tagCounts = posts
		.flatMap((post) => post.tags)
		.reduce((acc, tag) => {
			const tagKey = tag.name;
			acc[tagKey] = (acc[tagKey] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

	const allTags = Object.keys(tagCounts);

	const handleClick = (tag: string) => {
		dispatch(commonAction.setSearchFilter(tag));
		router.push('/');
	}

	return (
		<TagWrapper>
			<H3>Tag List</H3>
			<Divider $isDark={isDarkMode} />
			<TagListContainer>
				{allTags.map((tag, index) => (
					<TagItem key={index} $isDark={isDarkMode} onClick={() => handleClick(tag)}>
						{tag} <span>({tagCounts[tag]})</span>
					</TagItem>
				))}
			</TagListContainer>
		</TagWrapper>
	)
}