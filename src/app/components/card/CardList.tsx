import React from "react";
import Card from "./Card";
import styled, { keyframes } from "styled-components";
import { Post } from "@/app/api/blogApi";
import { useSelector } from "@/app/store";

const fadeIn = keyframes`
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

export const CardListContainer = styled.ul`
	animation: ${fadeIn} 0.3s ease-in-out;
  display: flex;
  flex-wrap: wrap;
	justify-content: center;
  gap: 20px;
  padding: 0;
  margin: 20px 0;
`;

interface CardListProps {
  posts: Post[]; 
}

const CardList = ({posts}:CardListProps) => {
  const isDarkMode = useSelector(state => state.common.isDark);

  return (
    <CardListContainer>
      {posts.map((post) => (
        <Card key={post.id} post={post} />
      ))}
    </CardListContainer>
  );
};

export default CardList;
