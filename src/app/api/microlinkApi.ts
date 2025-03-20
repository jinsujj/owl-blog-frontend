import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URI;
export type LinkPreview = {
  title: string;
  description: string;
  image: string;
};

export const getLinkPreview = async (url: string): Promise<LinkPreview | undefined> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/link-preview`, {
      params: { url },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Link preview not found");
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching link preview:", error);
    return undefined;
  }
};