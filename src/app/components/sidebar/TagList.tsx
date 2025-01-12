import { Post } from "@/app/api/blogApi";
import { useSelector } from "@/app/store";
import palette from "@/app/styles/palette";
import styled from "styled-components";

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
  margin: 10px 0;
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
	posts: Post[];
}

export const TagList =({posts}: TagListProps) => {
	const isDarkMode = useSelector((state) => state.common.isDark);

	const tagCounts = posts
    .flatMap((post) => post.tags)
    .reduce((acc,tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
  }, {} as Record<string,number>);

  const allTags = Object.keys(tagCounts);
	
	return (
		<TagWrapper>
		<H3>Tag List</H3>
		<Divider $isDark={isDarkMode} />
		<TagListContainer>
			{allTags.map((tag, index) => (
				<TagItem key={index} $isDark={isDarkMode}>
					{tag} <span>({tagCounts[tag]})</span>
				</TagItem>
			))}
		</TagListContainer>
	</TagWrapper>
	)
}