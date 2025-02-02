"use client";

import Header from "./components/header/Header";
import { useSelector } from "./store";
import styled from "styled-components";
import CardList from "./components/card/CardList";
import { UserProfile } from "./components/common/UserProfile";
import { Suspense, useEffect, useState } from "react";
import { HiMiniSquares2X2, HiBars3 } from "react-icons/hi2";
import ListView from "./components/list/ListView";
import { commonAction } from "./store/common";
import { useDispatch } from "react-redux";
import SideBar from "./components/sidebar/Sidebar";
import WidthSlider from "./components/common/WidthSlder";
import { getBlogSummary, Post } from "./api/blogApi";
import { useRouter } from "next/navigation";
import { checkTokenValidity, getKakaoToken } from "./api/loginApi";
import SearchParamsHandler from "./components/SearchParamhandler";

interface StyledProps {
	$isDark: boolean;
}

const PageContainer = styled.div<StyledProps>`
  padding: 0;
  margin: 0;
	min-height: 100vh;
  font-family: Arial, sans-serif;
  background-color: ${(props) => (props.$isDark ? "#333" : "#fff")};
  color: ${(props) => (props.$isDark ? "#ddd" : "#333")};
`;

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  background-color: #fff;
`;

const LayoutWrapper = styled.main<{ width: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  max-width: ${(props) => props.width};
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const ToggleWrapper = styled.div`
 	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: 10px 40px;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: #f1f1f1;
  color: #333;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

const SliderWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 100px;
	z-index: 1000;

	@media (max-width: 768px) {
    display: none;
  }
`;


const HomePage = () => {
	// router
	const router = useRouter();
	// status
	const dispatch = useDispatch();
	const searchQuery = useSelector((state) => state.common.search);
	const isDarkMode = useSelector((state) => state.common.isDark);
	const [isListView, setIsListView] = useState(false);
	const [editorMaxWidth, setEditorMaxWidth] = useState<string>('980px');
	const [code, setCode] = useState<string | null>(null);
	// posts
	const [posts, setPosts] = useState<Post[]>([]);

	// dynamic size effect
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 768) {
				setIsListView(true);
				dispatch(commonAction.setToggle(false));
			} else {
				setIsListView(false);
				dispatch(commonAction.setToggle(true));
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [dispatch]);

	// login token 
	useEffect(() => {
		if (!code){
			checkTokenValidity().then((validToken) => {
				if(validToken) dispatch(commonAction.setLogged(true));
			});
			return;
		}

		const handleKakaoLogin = async () => {
			try {
				const kakaoToken = await getKakaoToken(code);
				if (kakaoToken !== null) {
					dispatch(commonAction.setLogged(true));
				}
			} catch (error) {
				console.error("Error in kakao login process:", error);
			} finally {
				const newParams = new URLSearchParams();
				newParams.delete("code");
				if (typeof window !== "undefined") {
					window.history.replaceState({}, "", `/?${newParams.toString()}`);
				}
			}
		};
		handleKakaoLogin();
	}, [code, router]);

	const handleWidthChage = (width: number) => {
		setEditorMaxWidth(`${width}px`);
	}

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const posts = await getBlogSummary();
				setPosts(posts);
			} catch (error) {
				console.error("Failed to fetch posts:", error);
			}
		};

		fetchPosts();
	}, []);


	const filteredPosts = searchQuery
		? posts.filter((post) =>
			post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.tags.some((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase())))
		: posts;

	return (
		<PageContainer $isDark={isDarkMode}>
			<HeaderWrapper>
				<Header />
			</HeaderWrapper>
			<Suspense fallback={<div>인증 처리 중...</div>}>
				<SearchParamsHandler onCodeReceived={setCode} />
				<SideBar />
				<LayoutWrapper width={editorMaxWidth}>
					<UserProfile />
					<ToggleWrapper>
						<ToggleButton onClick={() => setIsListView(!isListView)}>
							{isListView ? <HiMiniSquares2X2 size={20} /> : <HiBars3 size={20} />}
						</ToggleButton>
					</ToggleWrapper>
					{isListView ?
						(<ListView posts={filteredPosts} />) : (<CardList posts={filteredPosts} />)}
				</LayoutWrapper>
				<SliderWrapper>
					<WidthSlider defaultWidth={980} onWidthChange={handleWidthChage} />
				</SliderWrapper>
			</Suspense>
		</PageContainer>
	);
};

export default HomePage;
