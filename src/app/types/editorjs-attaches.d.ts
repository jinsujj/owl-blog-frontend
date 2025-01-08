declare module '@editorjs/attaches' {
  import { ToolConstructable } from '@editorjs/editorjs';

  interface AttachesConfig {
    endpoint: string; // 서버 URL
    additionalRequestHeaders?: Record<string, string>; // 추가 HTTP 헤더
  }

  const AttachesTool: ToolConstructable & {
    config: AttachesConfig;
  };

  export default AttachesTool;
}
