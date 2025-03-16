import exp from "constants";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URI;

const CustomAttachesUploader = {
  async uploadByFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BASE_URL}/files/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("파일 업로드 실패");
      }

      // 백엔드에서 반환하는 기존 응답을 받아옴
      const backendResponse = await response.json();

      // 기존 응답을 Editor.js에서 기대하는 형태로 변환
      return {
        success: 1,
        file: {
          url: backendResponse.fileUrl || backendResponse.url, // 백엔드 응답에 따라 수정
          name: file.name,
          size: file.size,
        },
      };
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
      return { success: 0 };
    }
  },
};


export default CustomAttachesUploader;