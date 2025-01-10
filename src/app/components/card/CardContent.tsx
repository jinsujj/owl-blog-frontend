import { Post } from "@/app/api/blogApi";
import React from "react";
import styled from "styled-components";


export const CardList = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 0;
  margin: 20px 0;
`;

export const Card = styled.li`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  width: 300px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  a {
    text-decoration: none;
    color: inherit;
    display: block;
  }
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

export const CardContent = styled.div`
  padding: 15px;
`;

export const CardTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
`;

export const CardSummary = styled.p`
  font-size: 0.95rem;
  margin-bottom: 10px;
	-webkit-line-clamp: 5; 
	text-overflow: ellipsis;
	word-wrap: break-word;
  color: #666;
`;

export const CardDate = styled.time`
  font-size: 0.85rem;
  color: #999;
`;


interface CardProps {
  post: Post;
}

const CardContent = ({ post }: CardProps) => {
  return (
    <CardContentContainer>
      <CardTitle>{post.title}</CardTitle>
      <CardSummary>
        {post.summary.length > 200 ? `${post.summary.slice(0, 200)}...` : post.summary}
      </CardSummary>
      <CardDate dateTime={post.updatedAt}>
        Updated: {new Date(post.updatedAt).toLocaleDateString()}
      </CardDate>
    </CardContentContainer>
  );
};

export default CardContent;
