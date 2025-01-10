import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const createBlog = async (title:string, content: string) => {
	const response = await axios.post(`${BASE_URL}/blogs`, {title, content});
	return response.data;
}