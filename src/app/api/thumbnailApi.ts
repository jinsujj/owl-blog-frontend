import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URI;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data',
  },
});

export interface thumbnailResponse {
  fileUrl: string;
}

export const uploadThumbnail = async (file: File):Promise<thumbnailResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    try{
        const response = await apiClient.post(`/files/upload`,formData);
        return response.data;

    } catch (error) {
        console.error('Failed to upload file:', error);
        throw error;
    }
}

export const removeThumbnail = async (fileName: string):Promise<void> => {
    try {
      const response = await axios.delete(`${BASE_URL}/files/upload`, {params: {fileName}});
      if (response.status === 200) 
        return response.data; 
      
          else {
        console.log("Blog not found");
        return undefined; 
      }
    } catch (error) {
      console.log("Error fetching blog: " + error);
      return undefined; 
    }
  };