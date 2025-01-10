declare module '@editorjs/link' {
  import { ToolConstructable } from '@editorjs/editorjs';

  interface LinkToolConfig {
    endpoint: string; // 서버 URL
  }

  const LinkTool: ToolConstructable & {
    config: LinkToolConfig;
  };

  export default LinkTool;
}
