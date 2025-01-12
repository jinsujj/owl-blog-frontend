import { Post } from "@/app/api/blogApi";
import { useSelector } from "@/app/store";
import styled, { keyframes } from "styled-components";


interface StyledProps {
	$isDark: boolean;
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
        gap:20px;
        padding: 15px;
        border-radius: 10px;
        background-color: ${(props) => (props.$isDark? "#444" : "#FAFAFA")};
        box-shadow: 0 4px 6px rgba(0,0,0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;

        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0,0,0, 0.15);
        }
    }

    .thumbnail {
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 200px;
        width: 100%;
        flex-shrink: 0;
        border-radius: 8px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        box-shadow: 0 2px 4px rgba(0,0,0 0.1);
        margin-bottom: -2px;
    }

    .content {
        flex-grow: 18px;
        font-weight: bold;
        margin-bottom: 5px;
        color: ${(props: StyledProps) => (props.$isDark ? "#fff": "#333")};
    }

    .summary {
        font-size: 14px;
        line-height: 1.4;
        color: ${(props: StyledProps) => (props.$isDark ? "#ddd" : "#666") };
    }

    .meta {
        font-size: 12px ;
        color: ${(props: StyledProps) => (props.$isDark ? "#aaa" : "#999")};
        margin-top: 10px;
    }
`;

interface ListViewProps {
  posts: Post[]; 
}

const ListView = ({posts}: ListViewProps) => {
    const isDarkMode = useSelector((state) => state.common.isDark);
    
    return (
        <ListViewContainer $isDark={isDarkMode}>
            {posts.map((post) => (
                <div className="list-item" key={post.id}>
                    <img className="thumbnail" src={post.thumbnail} alt={`Thumbnail of ${post.title}`} />
                    <div className="content">
                        <div className="title">{post.title}</div>
                        <div className="summary">	{post.summary.length > 250 ? `${post.summary.slice(0,250)}...` : post.summary}</div>
                        <div className="meta">Updated at: {post.updatedAt}</div>
                    </div>
                </div>
            ))}
        </ListViewContainer>
    )
}

export default ListView;