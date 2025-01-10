'use client';

import React, {useState} from "react";
import Button from "../components/common/Button";
import palette from "../styles/palette";
import WidthSlider from "../components/editor/WidthSlder";
import styled from "styled-components";
import { BlogOutputData } from "../types/editor";
import { createBlog } from "../api/blogApi";
import dynamic from "next/dynamic";


const Container = styled.div`
   padding: 20px;
	 max-width: 1400px;
	 margin: 0 auto;
`;

const SliderWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 100px;
	z-index: 1000;
`;

const Editor = dynamic(() => import("./Editor"), { ssr: false });

const EditorPage: React.FC = () => {
	const [isReadOnly, setIsReadOnly] = useState(false);
	const [editorData, setEditorData] = useState<BlogOutputData>({title: '', version: undefined, time: undefined, blocks: []});
	const [editorMaxWidth, setEditorMaxWidth] = useState<string>('650px');

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
		}
		catch(error){
			console.log("Error creating blog:", error);
		}
	}

	const handleWidthChage = (width: number) =>{
		setEditorMaxWidth(`${width}px`);
	}


	return (
    <Container>
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