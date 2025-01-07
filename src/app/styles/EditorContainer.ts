import styled from "styled-components";

interface EditorContainerProps {
  $isReadOnly: boolean;
  $maxWidth: string;
}

export const EditorContainer = styled.div<EditorContainerProps>`
  #editorjs pre {
    border: ${(props) => (props.$isReadOnly ? "none" : "1px solid #ccc")};
  }

  .ce-toolbar__content {
    max-width: ${(props) => props.$maxWidth};
    margin: 0 auto;
    position: relative;
  }
`;
