'use client';

import React, {useState} from "react";
import palette from "../styles/palette";
import WidthSlider from "../components/common/WidthSlder";
import styled from "styled-components";
import { BlogOutputData } from "../types/editor";
import { createBlog } from "../api/blogApi";
import dynamic from "next/dynamic";
import useModal from "../hooks/useModal";
import MessageModal from "../components/modal/MessageModal";
import Header from "../components/header/Header";
import { useSelector } from "../store";
import SideBar from "../components/sidebar/Sidebar";

interface StyledProps {
	$isDark: boolean;
}

const Container = styled.div<StyledProps>`
   min-height: 100vh;
	 margin: 0 auto;
	 background-color: ${(props) => (props.$isDark ? "#333" : "#fff")};
	 color: ${(props) => (props.$isDark ? "#ddd" : "#333")};
`;

const SliderWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 100px;
	z-index: 1000;
`;

const Editor = dynamic(() => import("./Editor"), { ssr: false });

const EditorPage: React.FC = () => {
  const isDarkMode = useSelector((state) => state.common.isDark);
	const [modalMessage, setModalMessage] = useState('');
	const [alertColor, setAlertColor] = useState('');
	const [editorData, setEditorData] = useState<BlogOutputData>({title: '', version: undefined, time: undefined, blocks: []});
	const [editorMaxWidth, setEditorMaxWidth] = useState<string>('650px');
	const { openModal, closeModal, ModalPortal } = useModal();

	const handleSave = async (data:BlogOutputData) => {
		console.log("Saved Data:", data);
		setEditorData(data);

		const {title, blocks} = data;
		const content = JSON.stringify(blocks);

		try{
			const result = await createBlog(title, content);
			console.log('Blog created successfully', result);
			setModalMessage("Blog created successfully!");
			setAlertColor(palette.green);
			openModal();
		}
		catch(error){
			console.log("Error creating blog:", error);
			setModalMessage("Failed to create blog. Please try again.");
			setAlertColor(palette.red);
			openModal();
		}
	}

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



	return (
    <Container $isDark={isDarkMode}>
			<Header />
			<ModalPortal>
				<MessageModal message={modalMessage} onClose={closeModal} color={alertColor} />
			</ModalPortal>
			<SideBar posts={posts} />
      <Editor initialData={editorData} editorMaxWidth={editorMaxWidth} onSave={handleSave} />
			<SliderWrapper>
				<WidthSlider defaultWidth={650} onWidthChange={handleWidthChage}/>
			</SliderWrapper>
    </Container>
  );
};

export default EditorPage;