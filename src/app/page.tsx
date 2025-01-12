"use client";

import Header from "./components/header/Header";
import { useSelector } from "./store";
import styled from "styled-components";
import CardList from "./components/card/CardList";
import { UserProfile } from "./components/common/UserProfile";
import { useEffect, useState } from "react";
import { HiMiniSquares2X2, HiBars3 } from "react-icons/hi2";
import ListView from "./components/list/ListView";
import { commonAction } from "./store/common";
import { useDispatch } from "react-redux";
import SideBar from "./components/sidebar/Sidebar";
import WidthSlider from "./components/common/WidthSlder";

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

const LayoutWrapper = styled.main<{width: string}>`
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
  const dispatch = useDispatch();
	const searchQuery = useSelector((state) => state.common.search);
  const isDarkMode = useSelector((state) => state.common.isDark);
	const [isListView, setIsListView] = useState(false); 
	const [editorMaxWidth, setEditorMaxWidth] = useState<string>('980px');

	// dynamic size effect
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
  }, [dispatch]);
  
	const handleWidthChage = (width: number) =>{
		setEditorMaxWidth(`${width}px`);
	}

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
      <SideBar posts={posts} />
      <LayoutWrapper width={editorMaxWidth}>
        <UserProfile/>
        <ToggleWrapper>
          <ToggleButton onClick={() => setIsListView(!isListView)}>
            {isListView ? <HiMiniSquares2X2 size={20} /> : <HiBars3 size={20} />}
          </ToggleButton>
        </ToggleWrapper>
        {isListView ? 
          (<ListView posts={filteredPosts}/>) : (<CardList posts={filteredPosts} />)}
      </LayoutWrapper>
			<SliderWrapper>
				<WidthSlider defaultWidth={980} onWidthChange={handleWidthChage}/>
			</SliderWrapper>
    </PageContainer>
  );
};

export default HomePage;
