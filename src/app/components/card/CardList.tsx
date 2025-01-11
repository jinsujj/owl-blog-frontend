import React from "react";
import Card from "./Card";
import styled from "styled-components";
import { Post } from "@/app/api/blogApi";


export const CardListContainer = styled.ul`
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
  return (
    <CardListContainer>
      {posts.map((post) => (
        <Card key={post.id} post={post} />
      ))}
    </CardListContainer>
  );
};

export default CardList;
