'use client';

import { OutputData } from "@editorjs/editorjs";
import React, {useState} from "react";
import Editor from "./Editor";
import Button from "../components/common/Button";
import palette from "../styles/palette";
import WidthSlider from "../components/editor/WidthSlder";
import styled from "styled-components";


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

const EditorPage: React.FC = () => {
	const [isReadOnly, setIsReadOnly] = useState(false);
	const [editorData, setEditorData] = useState<OutputData>({blocks: []});
	const [editorMaxWidth, setEditorMaxWidth] = useState<string>('650px');

	const toggleMode = () => {
		setIsReadOnly((prev) => !prev);
	}

	const handleSave = (data:OutputData) => {
		console.log("Saved Data:", data);
		setEditorData(data);
	}

	const handleWidthChage = (width: number) =>{
		setEditorMaxWidth(`${width}px`);
	}


	return (
    <Container>
      <h1>Editor.js Example with Next.js 15</h1>
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