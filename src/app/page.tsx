"use client";

import Header from "./components/header/Header";
import { useSelector } from "./store";
import styled from "styled-components";
import CardList from "./components/card/CardList";
import { UserProfile } from "./components/common/UserProfile";
import { Suspense, useCallback, useEffect, useState } from "react";
import { HiMiniSquares2X2, HiBars3 } from "react-icons/hi2";
import ListView from "./components/View/ListView";
import { commonAction } from "./store/common";
import { useDispatch } from "react-redux";
import SideBar from "./components/sidebar/Sidebar";
import WidthSlider from "./components/common/WidthSlder";
import { createBlog, getBlogByType, getBlogSummary, Post } from "./api/blogApi";
import { useRouter } from "next/navigation";
import { checkTokenValidity, getKakaoToken, getKakaoUserInfo } from "./api/loginApi";
import SearchParamsHandler from "./components/SearchParamhandler";
import { authAction } from "./store/auth";
import { OutputData } from "@editorjs/editorjs/types/data-formats/output-data";
import dynamic from "next/dynamic";
import SeriesView from "./components/View/SeriesView";

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

const Editor = dynamic(() => import("./editor/Editor"), { ssr: false });

const HomePage = () => {
	// router
	const router = useRouter();
	// status
	const dispatch = useDispatch();
	const isLogged = useSelector((state) => state.auth.isLogged);
	const userId = useSelector((state) => state.auth.id);
	const searchQuery = useSelector((state) => state.common.search);
	const isDarkMode = useSelector((state) => state.common.isDark);
	const [isListView, setIsListView] = useState(false);
	const [editorMaxWidth, setEditorMaxWidth] = useState<string>('980px');
	const [code, setCode] = useState<string | null>(null);
	const renderTab = useSelector((state) => state.common.renderTab);
	const [editorData, setEditorData] = useState<OutputData>({ version: undefined, time: undefined, blocks: [] });
	// posts
	const [posts, setPosts] = useState<Post[]>([]);

	// dynamic size effect
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 768) {
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

	// dark mode 
	useEffect(() => {
		const now = new Date();
		const utcNow = now.getTime() + now.getTimezoneOffset() * 60 * 1000; 
		const koreanTimeDiff = 9 * 60 * 60 * 1000;
		const koreaNow = new Date(utcNow + koreanTimeDiff);
		if (18 <= koreaNow.getHours() || koreaNow.getHours() <= 6) 
			dispatch(commonAction.setDarkMode(true));
		else 
			dispatch(commonAction.setDarkMode(false));
	},[dispatch])

	// login token 
	useEffect(() => {
		if (!code) {
			checkTokenValidity().then((validToken) => {
				if (!validToken) return;
				dispatch(authAction.setLogged(true));
			});
			return;
		}
		const handleKakaoLogin = async () => {
			try {
				const kakaoToken = await getKakaoToken(code);
				if (kakaoToken !== null) {
					dispatch(authAction.setLogged(true));
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

	// blog info 
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
	}, [isLogged]);

	// userinfo
	useEffect(() => {
		if (isLogged)
			setUserInfo();
	}, [isLogged]);

	const setUserInfo = useCallback(async () => {
		try {
			const userInfo = await getKakaoUserInfo();
			dispatch(authAction.setUserId(userInfo?.id || ''));
			dispatch(authAction.setUserName(userInfo?.userName || ''));
			dispatch(authAction.setImageUrl(userInfo?.imageUrl || ''));
			dispatch(authAction.setEmail(userInfo?.email || ''));
		} catch (error) {
			console.error("Error setting userInfo:", error);
		}
	}, [dispatch]);

	// Introduce Blog
	useEffect(() => {
		const fetchIntroduceBlog = async () => {
			const data = await getBlogByType("Introduce");
			setEditorData(data?.content ?? { version: "2.27.0", time: Date.now(), blocks: [] });
		};
		fetchIntroduceBlog();
	}, []);


	const handleWidthChage = (width: number) => {
		setEditorMaxWidth(`${width}px`);
	}

	const handleSave = async (data: OutputData) => {
		setEditorData(data);
		const content = JSON.stringify(data);
		await createBlog(userId, "Introduce", content,'', [], "Introduce");
	}

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
			<SideBar />
			<Suspense fallback={<div>인증 처리 중...</div>}>
				<SearchParamsHandler onCodeReceived={setCode} />
				<LayoutWrapper width={editorMaxWidth}>
					<UserProfile />
					{renderTab === '글' && (
						<>
							<ToggleWrapper>
								<ToggleButton onClick={() => setIsListView(!isListView)}>
									{isListView ? <HiMiniSquares2X2 size={20} /> : <HiBars3 size={20} />}
								</ToggleButton>
							</ToggleWrapper>
							{isListView ? <ListView posts={filteredPosts} /> : <CardList posts={filteredPosts} />}
						</>
					)}
					{renderTab === '시리즈' && <SeriesView />}
					{renderTab === '소개' && (
						<>
							<Editor initialData={editorData} editorMaxWidth={editorMaxWidth} onSave={handleSave} isReadOnly={!isLogged} imageUrl={''} setImageUrl={() => { }} />
						</>
					)}
				</LayoutWrapper>
				<SliderWrapper>
					<WidthSlider defaultWidth={980} onWidthChange={handleWidthChage} />
				</SliderWrapper>
			</Suspense>
		</PageContainer>
	);
};

export default HomePage;
