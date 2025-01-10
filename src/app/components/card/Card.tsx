import React from "react";
import styled from "styled-components";
import { Post } from "@/app/api/blogApi";
import Image from "next/image";

export const CardContainer = styled.li`
	padding: 10px;
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

interface CardProps {
  post: Post;
}

const Card = ({ post }: CardProps) => {
  return (
    <CardContainer>
      <a href={`/post/${post.id}`}>
				<Image 
					src={post.thumbnail} 
					alt={post.title} 
					width={300} 
					height={200} 
					layout="responsive" 
					style={{ width: "100%" }} 
        />
        <div>
          <h3>{post.title}</h3>
          <p>{post.summary}</p>
          <time dateTime={post.updatedAt}>
            Updated: {new Date(post.updatedAt).toLocaleDateString()}
          </time>
        </div>
      </a>
    </CardContainer>
  );
};

export default Card;
