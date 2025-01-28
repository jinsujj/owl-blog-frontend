import { PostSummary } from "@/app/api/blogApi";
import { useSelector } from "@/app/store";
import Link from "next/link";
import styled, { keyframes } from "styled-components";

interface StyledProps {
	$isDark: boolean;
	$isPublished?: boolean;
}

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

const ListViewContainer = styled.div<StyledProps>`
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    animation: ${fadeIn} 0.3s ease-in-out;

    .list-item {
        display: flex;
        align-items: center; 
        gap: 20px;
        padding: 15px;
        border-radius: 10px;
        background-color: ${(props) => (props.$isDark ? "#444" : "#FAFAFA")};
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;

        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
    }
`;

const ListItem = styled.div<StyledProps>`
	display: flex;
	align-items: center; 
	gap: 20px;
	padding: 15px;
	border-radius: 10px;
	background-color: ${(props) =>
		props.$isPublished
			? props.$isDark
				? "#444"
				: "#FAFAFA"
			: props.$isDark
				? "#666"
				: "#F5F5F5"
	};

	box-shadow: ${(props) =>
		props.$isPublished
			? props.$isDark
				? "0 2px 5px rgba(0, 0, 0, 0.4)"
				: "0 2px 5px rgba(0, 0, 0, 0.1)"
			: props.$isDark
				? "0 2px 5px rgba(0, 0, 0, 0.2)"
				: "0 2px 5px rgba(0, 0, 0, 0.05)"

	};
	opacity: ${(props) => (props.$isPublished ? "0.6" : "1")};
	transition: transform 0.2s ease, box-shadow 0.2s ease;

	&:hover {
			transform: translateY(-5px);
			box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
	}
`;

const Thumbnail = styled.img`
  width: 200px;
  height: 120px;
  object-fit: cover;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
`;

const Content = styled.div<StyledProps>`
	display: flex;
	flex-direction: column; 
	gap: 10px;
	flex-grow: 1; 
	color: ${(props: StyledProps) => (props.$isDark ? "#fff" : "#333")};
`;

const Title = styled.div<StyledProps>`
	font-weight: bold;
	font-size: 18px; 
	color: ${(props: StyledProps) => (props.$isDark ? "#fff" : "#333")};
`;

const Summary = styled.div<StyledProps>`
	font-size: 14px;
	line-height: 1.6;
	color: ${(props: StyledProps) => (props.$isDark ? "#ddd" : "#666")};
`;

const Meta = styled.div<StyledProps>`
	font-size: 12px;
	color: ${(props: StyledProps) => (props.$isDark ? "#aaa" : "#999")};
`;


interface ListViewProps {
	posts: PostSummary[];
}

const ListView = ({ posts }: ListViewProps) => {
	const isDarkMode = useSelector((state) => state.common.isDark);

	return (
		<ListViewContainer $isDark={isDarkMode}>
			{posts.map((post) => (
				<Link href={`/blog/${post.id}`} key={post.id}>
					<ListItem $isDark={isDarkMode} $isPublished={!!!post.publishedAt} key={post.id}>
						<Thumbnail src={post.thumbnailUrl || "/img/owl.svg"} alt={`Thumbnail of ${post.title}`} loading="lazy" />
						<Content $isDark={isDarkMode}>
							<Title $isDark={isDarkMode}>{post.title}</Title>
							<Summary $isDark={isDarkMode}>{post.summary?.length > 250 ? `${post.summary.slice(0, 250)}...` : post.summary}</Summary>
							<Meta $isDark={isDarkMode}>Updated at: {post.updatedAt}</Meta>
						</Content>
					</ListItem>
				</Link>
			))}
		</ListViewContainer>
	)
}

export default ListView;