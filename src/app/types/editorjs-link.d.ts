declare module '@editorjs/link' {
  import { ToolConstructable, ToolSettings } from '@editorjs/editorjs';

  interface LinkToolConfig {
    endpoint: string; // 서버 URL
  }

  const LinkTool: ToolConstructable & {
    config: LinkToolConfig;
  };

  export default LinkTool;
}
