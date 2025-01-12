"use client";

import Header from "./components/common/Header";
import { useSelector } from "./store";
import styled from "styled-components";
import CardList from "./components/card/CardList";
import { UserProfile } from "./components/common/UserProfile";
import { useEffect, useState } from "react";
import { HiMiniSquares2X2, HiBars3 } from "react-icons/hi2";
import ListView from "./components/list/ListView";
import palette from "@/app/styles/palette";
import { HiSearch } from "react-icons/hi";
import { commonAction } from "./store/common";
import { useDispatch } from "react-redux";

interface StyledProps {
	$isDark: boolean;
}

interface SideBarProps {
  $isDark: boolean;
  $isSidebarOpen: boolean; 
}


const PageContainer = styled.div<StyledProps>`
  padding: 0;
  margin: 0;
	min-height: 100vh;
  font-family: Arial, sans-serif;
  background-color: ${(props) => (props.$isDark ? "#333" : "#fff")};
  color: ${(props) => (props.$isDark ? "#fff" : "#333")};
`;

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  background-color: #fff;
`;

const LayoutWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 
  max-width: 980px; 
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

const SideBar = styled.div<SideBarProps>`
  position: fixed;
  left: ${(props) => (props.$isSidebarOpen ? "0" : "-240px")};
  width: 230px;
  height: calc(100vh - 50px);
  background-color: ${(props) => (props.$isDark ? "#444" : "#f9f9f9")};
  border-right: 1px solid ${(props) => (props.$isDark ? "#555" : "#ddd")};
  overflow-y: auto;
  transition: left 0.3s ease;
  z-index: 5; 
  padding: 20px;
  align-items: center;
  justify-content: center;
`;

const TagList = styled.ul`
  list-style: none;
  padding: 20px 0px;
`;

const H3 = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
`;

const TagItem = styled.li<StyledProps>`
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.$isDark ? "#fff" : "#333")};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    color: ${(props) => (props.$isDark ? "#ffcc00" : "#007bff")};
    text-decoration: underline;
    cursor: pointer;
  };

  span {
    color: ${palette.green};
    margin-left: 5px;
  };
`;

const VisitorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const VisitorInfo = styled.div<StyledProps>`
  width: 80%;
  padding: 10px 0px;
  border-radius: 10px;
  background-color: ${(props) => (props.$isDark ? "#555" : "#f1f1f1")};
  color: ${(props) => (props.$isDark ? "#fff": "#333")};
  font-size: 14px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const VisitNumber = styled.div<StyledProps>`
  font-size: 14px;
  color : ${(props) => (props.$isDark ? "#ffcc00" : "#007bff")};
`;

const SearchWrapper = styled.div`
  padding: 0px;
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
`;

const SearchIcon = styled(HiSearch)`
  position: absolute;
  left: 10px;
  top:50px;
  transform: translateY(-150%);
  color: #ccc;
  font-size: 20px;
`;

const SearchInput = styled.input<StyledProps>`
  width: 100%;
  height: 38px;
  margin-top:10px;
  margin-bottom: 20px;
  padding: 0 10px 0 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size:16px;
  color: ${(props) => (props.$isDark ? "#eee" : "#333")};
  background-color: ${(props) => (props.$isDark ? "#444" : "fff")};
  transition: background-color 0.3s, border-color 0.3s;

  &:foucs {
    outline: none;
    border-color: #007bff;
    background-color: ${(props) => (props.$isDark ? "#555" : "#f1f1f1")};
  }
`;

const HomePage = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.common.isDark);
  const isSidebarOpen = useSelector((state) => state.common.toggle);
	const [isListView, setIsListView] = useState(false); 
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsListView(true); 
        dispatch(commonAction.setToggle(false));
      } else {
        setIsListView(false);
        dispatch(commonAction.setToggle(true));
      }};

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  

	const posts = [
    {
      id: 1,
      thumbnail: "https://backend.owl-dev.me/files/substation2.0.png",
      title: "헥사고날 아키텍처 적용기",
      summary: "선했던 11월 초, 어색하기도 하고 조금은 설레기도 했던 워커힐 파티… 기억나? 아침부터 마라톤하고 정신없이 움직여서 슬슬 지쳐가던 찰나에,  따뜻한 커피를 손난로 삼아 손에 꼭 쥔 우아한 모습과는 다르게,   마치 13:1로 싸운 후 손에 붙인 것 같은 반창고와  아침에 계단에서 넘어졌다는 허당미는 짧은 시간이었지만 내 기억 속에 강렬하게 남았어. 우연인지 인연인지, 옆에서 같이 스테이크를 먹으면서 보기와는 다르게  장난기 있는 모습도 보고, 티키타카 했던 그날은  집으로 돌아가는 길에도 너에 대한 생각이 떠나질 않더라.사실, 엘리트 스펙을 본 후에 조금 망설이기도 했지만,  용기 있는 자가 미인을 얻는다잖아? 그래서 연락하려고 했는데, 또 먼저 연락을 줘서 내심 엄청 방방 뛰면서 좋아했던 것 같아. 만나서도 그렇고, 나의 호감이 확신으로 이어지기까지 오래 걸리진 않았지만, 먼저 고백해 본 적이 까마득해서 그런지, 고백 멘트를 찾아보다가 회사분들에게 걸려서 놀림과 응원을 받으며 망신살도 뻗치고… 참 다사다난했던 것 같아. 그래도 나는 항상 내가 하고 싶은 일을 해왔었고, 우여곡절은 있었지만 대부분 이뤄왔던 것 같아. 애늙은이 같은 면모도 있고 걱정도 많은 송현이지만,  나의 다음 목표는 송현이를 많이 웃게 하는 거야. 비록 장기 목표만큼 힘든 것도 없지만, 나는 항상 마음먹은 건 이뤄왔으니, 한 번 믿어보는 거 어때? 추운 날씨에 쉽게 손이 차가워지는 부엉이지만,  네가 있어서 내 마음은 따뜻해. 사랑해~!",
      updatedAt: "2025-01-10",
      tags: ["React", "Next.js", "UI"],
    },
    {
      id: 2,
      thumbnail: "https://backend.owl-dev.me/files/240_F_301116262_PekbmeXJ4fp4Py0wZQvCJaaGezeKHDNX.jpg",
      title: "Post 2",
      summary: "This is a summary of Post 2.",
      updatedAt: "2025-01-09",
      tags: ["아키텍처", "Spring", "리팩토링"],
    },
		{
      id: 3,
      thumbnail: "https://backend.owl-dev.me/files//%ED%95%B4%EC%BB%A4%ED%86%A4.png",
      title: "헥사고날 아키텍처 적용기",
      summary: "선했던 11월 초, 어색하기도 하고 조금은 설레기도 했던 워커힐 파티… 기억나? 아침부터 마라톤하고 정신없이 움직여서 슬슬 지쳐가던 찰나에,  따뜻한 커피를 손난로 삼아 손에 꼭 쥔 우아한 모습과는 다르게,   마치 13:1로 싸운 후 손에 붙인 것 같은 반창고와  아침에 계단에서 넘어졌다는 허당미는 짧은 시간이었지만 내 기억 속에 강렬하게 남았어. 우연인지 인연인지, 옆에서 같이 스테이크를 먹으면서 보기와는 다르게  장난기 있는 모습도 보고, 티키타카 했던 그날은  집으로 돌아가는 길에도 너에 대한 생각이 떠나질 않더라.사실, 엘리트 스펙을 본 후에 조금 망설이기도 했지만,  용기 있는 자가 미인을 얻는다잖아? 그래서 연락하려고 했는데, 또 먼저 연락을 줘서 내심 엄청 방방 뛰면서 좋아했던 것 같아. 만나서도 그렇고, 나의 호감이 확신으로 이어지기까지 오래 걸리진 않았지만, 먼저 고백해 본 적이 까마득해서 그런지, 고백 멘트를 찾아보다가 회사분들에게 걸려서 놀림과 응원을 받으며 망신살도 뻗치고… 참 다사다난했던 것 같아. 그래도 나는 항상 내가 하고 싶은 일을 해왔었고, 우여곡절은 있었지만 대부분 이뤄왔던 것 같아. 애늙은이 같은 면모도 있고 걱정도 많은 송현이지만,  나의 다음 목표는 송현이를 많이 웃게 하는 거야. 비록 장기 목표만큼 힘든 것도 없지만, 나는 항상 마음먹은 건 이뤄왔으니, 한 번 믿어보는 거 어때? 추운 날씨에 쉽게 손이 차가워지는 부엉이지만,  네가 있어서 내 마음은 따뜻해. 사랑해~!",
      updatedAt: "2025-01-10",
      tags: ["React", "Next.js", "UI"],
    },
    {
      id: 4,
      thumbnail: "https://backend.owl-dev.me/files/240_F_301116262_PekbmeXJ4fp4Py0wZQvCJaaGezeKHDNX.jpg",
      title: "Post 2",
      summary: "This is a summary of Post 2.",
      updatedAt: "2025-01-09",
      tags: ["아키텍처", "Spring", "리팩토링"],
    },{
      id: 5,
      thumbnail: "https://backend.owl-dev.me/files/substation2.0.png",
      title: "헥사고날 아키텍처 적용기",
      summary: "선했던 11월 초, 어색하기도 하고 조금은 설레기도 했던 워커힐 파티… 기억나? 아침부터 마라톤하고 정신없이 움직여서 슬슬 지쳐가던 찰나에,  따뜻한 커피를 손난로 삼아 손에 꼭 쥔 우아한 모습과는 다르게,   마치 13:1로 싸운 후 손에 붙인 것 같은 반창고와  아침에 계단에서 넘어졌다는 허당미는 짧은 시간이었지만 내 기억 속에 강렬하게 남았어. 우연인지 인연인지, 옆에서 같이 스테이크를 먹으면서 보기와는 다르게  장난기 있는 모습도 보고, 티키타카 했던 그날은  집으로 돌아가는 길에도 너에 대한 생각이 떠나질 않더라.사실, 엘리트 스펙을 본 후에 조금 망설이기도 했지만,  용기 있는 자가 미인을 얻는다잖아? 그래서 연락하려고 했는데, 또 먼저 연락을 줘서 내심 엄청 방방 뛰면서 좋아했던 것 같아. 만나서도 그렇고, 나의 호감이 확신으로 이어지기까지 오래 걸리진 않았지만, 먼저 고백해 본 적이 까마득해서 그런지, 고백 멘트를 찾아보다가 회사분들에게 걸려서 놀림과 응원을 받으며 망신살도 뻗치고… 참 다사다난했던 것 같아. 그래도 나는 항상 내가 하고 싶은 일을 해왔었고, 우여곡절은 있었지만 대부분 이뤄왔던 것 같아. 애늙은이 같은 면모도 있고 걱정도 많은 송현이지만,  나의 다음 목표는 송현이를 많이 웃게 하는 거야. 비록 장기 목표만큼 힘든 것도 없지만, 나는 항상 마음먹은 건 이뤄왔으니, 한 번 믿어보는 거 어때? 추운 날씨에 쉽게 손이 차가워지는 부엉이지만,  네가 있어서 내 마음은 따뜻해. 사랑해~!",
      updatedAt: "2025-01-10",
      tags: ["React", "Next.js", "UI"],
    },
    {
      id: 7,
      thumbnail: "https://backend.owl-dev.me/files//%ED%95%B4%EC%BB%A4%ED%86%A4.png",
      title: "Post 2",
      summary: "This is a summary of Post 2.",
      updatedAt: "2025-01-09",
      tags: ["아키텍처", "Spring", "리팩토링"],
    },{
      id: 6,
      thumbnail: "",
      title: "헥사고날 아키텍처 적용기",
      summary: "선했던 11월 초, 어색하기도 하고 조금은 설레기도 했던 워커힐 파티… 기억나? 아침부터 마라톤하고 정신없이 움직여서 슬슬 지쳐가던 찰나에,  따뜻한 커피를 손난로 삼아 손에 꼭 쥔 우아한 모습과는 다르게,   마치 13:1로 싸운 후 손에 붙인 것 같은 반창고와  아침에 계단에서 넘어졌다는 허당미는 짧은 시간이었지만 내 기억 속에 강렬하게 남았어. 우연인지 인연인지, 옆에서 같이 스테이크를 먹으면서 보기와는 다르게  장난기 있는 모습도 보고, 티키타카 했던 그날은  집으로 돌아가는 길에도 너에 대한 생각이 떠나질 않더라.사실, 엘리트 스펙을 본 후에 조금 망설이기도 했지만,  용기 있는 자가 미인을 얻는다잖아? 그래서 연락하려고 했는데, 또 먼저 연락을 줘서 내심 엄청 방방 뛰면서 좋아했던 것 같아. 만나서도 그렇고, 나의 호감이 확신으로 이어지기까지 오래 걸리진 않았지만, 먼저 고백해 본 적이 까마득해서 그런지, 고백 멘트를 찾아보다가 회사분들에게 걸려서 놀림과 응원을 받으며 망신살도 뻗치고… 참 다사다난했던 것 같아. 그래도 나는 항상 내가 하고 싶은 일을 해왔었고, 우여곡절은 있었지만 대부분 이뤄왔던 것 같아. 애늙은이 같은 면모도 있고 걱정도 많은 송현이지만,  나의 다음 목표는 송현이를 많이 웃게 하는 거야. 비록 장기 목표만큼 힘든 것도 없지만, 나는 항상 마음먹은 건 이뤄왔으니, 한 번 믿어보는 거 어때? 추운 날씨에 쉽게 손이 차가워지는 부엉이지만,  네가 있어서 내 마음은 따뜻해. 사랑해~!",
      updatedAt: "2025-01-10",
      tags: ["React", "Next.js", "UI"],
    },
    {
      id: 8,
      thumbnail: "https://backend.owl-dev.me/files/substation2.0.png",
      title: "Post 2",
      summary: "This is a summary of Post 2.",
      updatedAt: "2025-01-09",
      tags: ["아키텍처", "Spring", "리팩토링"],
    },
  ];

  const tagCounts = posts
    .flatMap((post) => post.tags)
    .reduce((acc,tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
  }, {} as Record<string,number>);

  const allTags = Object.keys(tagCounts);

  const totalVisit = 472312;
  const todayVisit = 54;

  const filteredPosts = searchQuery
    ? posts.filter((post) => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) 
      : posts;

  return (
    <PageContainer $isDark={isDarkMode}>
      <HeaderWrapper>
        <Header />  
      </HeaderWrapper>
      <SideBar $isDark={isDarkMode} $isSidebarOpen={isSidebarOpen}>
        <SearchWrapper>
          <SearchIcon/>
          <SearchInput
            $isDark={isDarkMode}
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
        </SearchWrapper>
          <H3>Tag List</H3>
          <TagList>
            {allTags.map((tag, index) => (
              <TagItem key={index} $isDark={isDarkMode}>
                {tag} <span>({tagCounts[tag]})</span>
              </TagItem>
            ))}
          </TagList>
          <VisitorWrapper>
            <VisitorInfo $isDark={isDarkMode}>
              Total <VisitNumber $isDark={isDarkMode}>{totalVisit.toLocaleString()}</VisitNumber>
              Today <VisitNumber $isDark={isDarkMode}>{todayVisit.toLocaleString()}</VisitNumber>
            </VisitorInfo>
          </VisitorWrapper>
      </SideBar>
      <LayoutWrapper>
        <UserProfile/>
        <ToggleWrapper>
          <ToggleButton onClick={() => setIsListView(!isListView)}>
            {isListView ? <HiMiniSquares2X2 size={20} /> : <HiBars3 size={20} />}
          </ToggleButton>
        </ToggleWrapper>
        {isListView ? 
          (<ListView posts={filteredPosts}/>) : (<CardList posts={filteredPosts} />)}
      </LayoutWrapper>
    </PageContainer>
  );
};

export default HomePage;
