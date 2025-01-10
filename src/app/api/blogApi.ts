import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export type Post = {
	id: number,
	thumbnail: string;
	title: string;
	summary: string;
	updatedAt: string;
}

export const createBlog = async (title:string, content: string) => {
	const response = await axios.post(`${BASE_URL}/blogs`, {title, content});
	return response.data;
}