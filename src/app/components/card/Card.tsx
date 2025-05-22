import React from "react";
import styled from "styled-components";
import { PostSummary } from "@/app/api/blogApi";
import { useSelector } from "@/app/store";
import Link from "next/link";
import Image from "next/image";

interface StyledProps {
	$isDark: boolean;
	$isPublished?: boolean;
}

const Container = styled.li<StyledProps>`
	background: ${(props) =>
		props.$isPublished
			? props.$isDark
				? "#666"
				: "#F5F5F5" :
			props.$isDark
				? "#444"
				: "#FAFAFA"};
	border: ${(props) =>
		props.$isPublished
			? props.$isDark
				? "1px dashed #666"
				: "1px dashed #bbb"
			: props.$isDark
				? "1px solid #555"
				: "1px solid #ddd"
	};
	border-radius: 10px;
	overflow: hidden;
	width: 290px;
	box-shadow: ${(props) =>
		props.$isPublished
			? props.$isDark
				? "0 2px 5px rgba(0, 0, 0, 0.2)"
				: "0 2px 5px rgba(0, 0, 0, 0.05)"
			: props.$isDark
				? "0 2px 5px rgba(0, 0, 0, 0.4)"
				: "0 2px 5px rgba(0, 0, 0, 0.1)"
	};
	opacity: ${(props) => (props.$isPublished ? "0.6" : "1")};
	transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;

	&:hover {
		transform: translateY(-5px);
		box-shadow: ${(props) =>
		props.$isPublished
			? props.$isDark
				? "0 4px 10px rgba(0, 0, 0, 0.4)"
				: "0 4px 10px rgba(0, 0, 0, 0.1)" :
			props.$isDark
				? "0 4px 10px rgba(0, 0, 0, 0.6)"
				: "0 4px 10px rgba(0, 0, 0, 0.2)"
	};
	}

	a {
		text-decoration: none;
		color: inherit;
		display: block;
	}
`;


export const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  height: 150px; 
  overflow: hidden;
  background: #ccc; 
`;

export const CardContent = styled.div`
  padding: 15px;
`;


export const CardTitle = styled.h3<StyledProps>`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: ${(props) => (props.$isDark ? "#eee" : "#333")};
`;

export const CardSummary = styled.p<StyledProps>`
  font-size: 0.95rem;
  margin-bottom: 10px;
	-webkit-line-clamp: 5; 
	text-overflow: ellipsis;
	word-wrap: break-word;
  color: ${(props) => (props.$isDark ? "#aaa" : "999")};
`;

export const CardDate = styled.time<StyledProps>`
  font-size: 0.85rem;
  color: ${(props) => (props.$isDark ? "#aaa" : "#999")};
`;


interface CardProps {
	post: PostSummary;
}

const Card = ({ post }: CardProps) => {
	const isDarkMode = useSelector(state => state.common.isDark);
	return (
		<Container $isDark={isDarkMode} $isPublished={!!!post.publishedAt}>
			<Link href={`/blog/${post.id}`}>
				<Thumbnail>
					<Image
						src={post.thumbnailUrl || "/img/owl.svg"}
						alt={`Thumbnail of ${post.title}`}
						style={{objectFit: "cover"}}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						priority={true}
						fill 
					/>
				</Thumbnail>
				<CardContent>
					<CardTitle $isDark={isDarkMode}>{post.title}</CardTitle>
					<CardSummary $isDark={isDarkMode}>
						{post.summary?.length > 120 ? `${post.summary.slice(0, 130)}...` : post.summary}
					</CardSummary>
					<CardDate $isDark={isDarkMode} dateTime={post.updatedAt}>
						Updated: {new Date(post.updatedAt).toLocaleDateString()}
					</CardDate>
				</CardContent>
			</Link>
		</Container>
	);
};

export default Card;
