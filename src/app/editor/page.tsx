'use client';

import React, {useState} from "react";
import Button from "../components/common/Button";
import palette from "../styles/palette";
import WidthSlider from "../components/editor/WidthSlder";
import styled from "styled-components";
import { BlogOutputData } from "../types/editor";
import { createBlog } from "../api/blogApi";
import dynamic from "next/dynamic";
import useModal from "../hooks/useModal";
import MessageModal from "../components/modal/MessageModal";
import Header from "../components/common/Header";
import { useSelector } from "../store";

interface StyledProps {
	$isDark: boolean;
}

const Container = styled.div<StyledProps>`
   min-height: 100vh;
	 margin: 0 auto;
	 background-color: ${(props) => (props.$isDark ? "#333" : "#fff")};
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
	const [isReadOnly, setIsReadOnly] = useState(false);
	const [editorData, setEditorData] = useState<BlogOutputData>({title: '', version: undefined, time: undefined, blocks: []});
	const [editorMaxWidth, setEditorMaxWidth] = useState<string>('650px');
	const { openModal, closeModal, ModalPortal } = useModal();

	const toggleMode = () => {
		setIsReadOnly((prev) => !prev);
	}

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


	return (
    <Container $isDark={isDarkMode}>
			<Header />
			  <ModalPortal>
          <MessageModal message={modalMessage} onClose={closeModal} color={alertColor} />
      	</ModalPortal>
      <Button onClick={toggleMode} color={palette.green}>
        {isReadOnly ? 'Read-Only': 'Edit Mode'}
      </Button>
      <Editor isReadOnly={isReadOnly} initialData={editorData} editorMaxWidth={editorMaxWidth} onSave={handleSave} />
			<SliderWrapper>
				<WidthSlider defaultWidth={650} onWidthChange={handleWidthChage}/>
			</SliderWrapper>
    </Container>
  );
};

export default EditorPage;