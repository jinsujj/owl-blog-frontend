import axios from "axios";

const BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadThumbnail = async (file: File):Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }

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