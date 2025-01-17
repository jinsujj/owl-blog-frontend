import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export type TagOption ={
	name: string,
	label: string,
}

export type Post = {
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