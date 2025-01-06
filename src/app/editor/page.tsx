'use client';

import { OutputData } from "@editorjs/editorjs";
import React, {useState} from "react";
import Editor from "./Editor";

const EditorPage: React.FC = () => {
	const [isReadOnly, setIsReadOnly] = useState(false);
	const [editorData, setEditorData] = useState<OutputData>({blocks: []});

	const toggleMode = () => {
		setIsReadOnly((prev) => !prev);
	}

	const handleSave = (data:OutputData) => {
		console.log("Saved Data:", data);
		setEditorData(data);
	}


	return (
    <div style={{ padding: '20px' }}>
      <h1>Editor.js Example with Next.js 15</h1>
      <button onClick={toggleMode} style={{ marginBottom: '10px', padding: '5px 10px' }}>
        {isReadOnly ? 'Switch to Edit Mode' : 'Switch to Read-Only Mode'}
      </button>
      <Editor isReadOnly={isReadOnly} initialData={editorData} onSave={handleSave} />
    </div>
  );
};

export default EditorPage;