import React from "react";
import styled from "styled-components";
import { Post } from "@/app/api/blogApi";
import { useSelector } from "@/app/store";

interface StyledProps {
  $isDark: boolean;
}

export const Container = styled.li<StyledProps>`
  background: ${(props) => (props.$isDark ? "#444" : "#FAFAFA")};
  border: ${(props) => (props.$isDark ? "1px solid #555" : "1px solid #ddd")};
  border-radius: 10px;
  overflow: hidden;
  width: 250px;
  box-shadow: ${(props) =>
    props.$isDark
      ? "0 2px 5px rgba(0, 0, 0, 0.4)"
      : "0 2px 5px rgba(0, 0, 0, 0.1)"};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${(props) =>
      props.$isDark
        ? "0 4px 10px rgba(0, 0, 0, 0.6)"
        : "0 4px 10px rgba(0, 0, 0, 0.2)"};
  }

  a {
    text-decoration: none;
    color: inherit;
    display: block;
  }
`;

export const Thumbnail = styled.img`
  width: 100%;
  object-fit: cover;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const CardContent = styled.div`
  padding: 15px;
`;


export const CardTitle = styled.h3<StyledProps>`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: ${(props) => (props.$isDark? "#eee" : "#333")};
`;

export const CardSummary = styled.p<StyledProps>`
  font-size: 0.95rem;
  margin-bottom: 10px;
	-webkit-line-clamp: 5; 
	text-overflow: ellipsis;
	word-wrap: break-word;
  color: ${(props) => (props.$isDark? "#aaa" : "999")};
`;

export const CardDate = styled.time<StyledProps>`
  font-size: 0.85rem;
  color: ${(props) => (props.$isDark ? "#aaa" : "#999")};
`;


interface CardProps {
  post: Post;
}

const Card = ({ post }: CardProps) => {
  const isDarkMode = useSelector(state => state.common.isDark);
  return (
    <Container $isDark={isDarkMode}>
      <a href={`/post/${post.id}`}>
				<Thumbnail src={post.thumbnail} alt={`Thumbnail of ${post.title}`} />
        <CardContent>
					<CardTitle $isDark={isDarkMode}>{post.title}</CardTitle>
					<CardSummary $isDark={isDarkMode}>
						{post.summary.length > 100 ? `${post.summary.slice(0,100)}...` : post.summary}
					</CardSummary>
					<CardDate $isDark={isDarkMode} dateTime={post.updatedAt}>
						Updated: {new Date(post.updatedAt).toLocaleDateString()}
					</CardDate>
				</CardContent>
      </a>
    </Container>
  );
};

export default Card;
