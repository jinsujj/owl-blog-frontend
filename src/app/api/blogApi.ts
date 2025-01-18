import { OutputData } from '@editorjs/editorjs/types/data-formats';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export type TagOption ={
	name: string,
	label: string,
}

export type Post = {
	id: number;
	thumbnail: string;
	title: string;
	content: OutputData;
	summary: string;
	createdAt: string;
	updatedAt: string;
	tags: TagOption[];
}

export type PostSummary = {
	id: number,
	thumbnail: string;
	title: string;
	summary: string;
	updatedAt: string;
	tags: TagOption[];
}

export const createBlog = async (title:string, content: string, tags?: TagOption[]) => {
	const response = await axios.post(`${BASE_URL}/blogs`, {title, content, tags});
	return response.data;
}

export const getBlogSummary = async() => {
	const response = await axios.get(`${BASE_URL}/blogs/summary`);
	return response.data;
}

export const getBlogById = async (id: string): Promise<Post | undefined> => {
  try {
    const response = await axios.get(`${BASE_URL}/blogs/${id}`);
    if (response.status === 200) {
      return response.data; 
    } else {
      console.log("Blog not found");
      return undefined; 
    }
  } catch (error) {
    console.log("Error fetching blog: " + error);
    return undefined; 
  }
};