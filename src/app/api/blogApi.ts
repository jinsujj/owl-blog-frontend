import { OutputData } from '@editorjs/editorjs/types/data-formats';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URI;

export type TagOption ={
	name: string,
	label: string,
}

export type Post = {
	id: number;
	author: string,
	thumbnailUrl: string;
	title: string;
	content: OutputData;
	summary: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	tags: TagOption[];
}

export type PostSummary = {
	id: number,
	thumbnailUrl: string;
	title: string;
	summary: string;
	updatedAt: string;
	publishedAt: string;
	tags: TagOption[];
}

export interface BlogResponse {
  id: string;
  title: string;
  content: string;
  tags: TagOption[];
  createdAt: string;
  updatedAt: string;
}


export const createBlog = async (userId: string, title: string, content: string, thumbnailUrl: string, tags?: TagOption[]): Promise<BlogResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/blogs`, {userId, title, content, thumbnailUrl, tags });
    return response.data; 
  } catch (error) {
    console.error("Error creating blog:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Response error:", error.response.data);
        throw new Error(error.response.data.message || "Failed to create blog");

      } else if (error.request) {
        console.error("No response received:", error.request);
        throw new Error("No response from the server");

      } else {
        console.error("Error during request setup:", error.message);
        throw new Error(error.message);
      }
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateBlog = async(id: number, userId: string, title: string, content: string, thumbnailUrl: string, tags?: TagOption[]) => {
	try{
		const response = await axios.put(`${BASE_URL}/blogs/${id}`,{userId, title, content, thumbnailUrl, tags: tags ??[]});
		return response.data;
	}
	catch(error){
		console.error("Error updating blog:", error);		
		if(axios.isAxiosError(error)){
			if(error.response){
				console.error("Response error:", error.response.data);
				throw new Error(error.response.data.message || "Failed to update blog");
			}
			if(error.request){
				console.error("No response received:", error.request);
				throw new Error("No response from the server");
			}
		}
	}
}

export const publishBlog = async(id: number) => {
	try{
		const response = await axios.post(`${BASE_URL}/blogs/${id}/publish`, {id});
		return response.data;
	}
	catch(error){
		if(axios.isAxiosError(error)){
			if(error.response){
				console.error("Response error:", error.response.data);
				throw new Error(error.response.data.message || "Failed to publish blog");
			}
			if(error.request){
				console.error("No response received:", error.request);
				throw new Error("No response from the server");
			}
		}
	}
}

export const unPublishBlog = async(id:number) => {
	try{
		const response = await axios.post(`${BASE_URL}/blogs/${id}/unpublish`,{id});
		return response.data;
	}
	catch(error){
		if(axios.isAxiosError(error)){
			if(error.response){
				console.error("Response error:", error.response.data);
				throw new Error(error.response.data.message || "Failed to unPublish blog");
			}
			if(error.request){
				console.error("No response received:", error.request);
				throw new Error("No response from the server");
			}
		}
	}
}

export const getBlogSummary = async() => {
	try{
		const response = await axios.get(`${BASE_URL}/blogs/summary`, {withCredentials: true});
		if(response.status === 200)
			return response.data;
		
		else {
			console.log("Blog  summary not found");
      return undefined; 
		}
	}
	catch (error) {
		console.error("Error fetching blog summry: "+ error);
		return undefined;
	}
}

export const getBlogById = async (id: string): Promise<Post | undefined> => {
  try {
    const response = await axios.get(`${BASE_URL}/blogs/${id}`);
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

export const getTagsAll = async(): Promise<TagOption[] | undefined> => {
	try{
		const response = await axios.get(`${BASE_URL}/blogs/tags`);
		if(response.status == 200)
			return response.data;

		else {
			console.log("Blog Tags not found");
			return undefined; 
		}
	}
	catch(error){
		console.error("Error fetching tags: "+ error);
		return undefined;
	}
}

export const getTagsByBlogId = async (id: string): Promise<TagOption[] | undefined> => {
	try{
		const response = await axios.get(`${BASE_URL}/blogs/${id}/tags`);
		if (response.status === 200)
			return response.data;

		else {
			console.log("Blog Tags not found");
			return undefined; 
		}
	}
	catch(error){
		console.error("Error fetching blog tags: "+ error);
		return undefined;
	}
}