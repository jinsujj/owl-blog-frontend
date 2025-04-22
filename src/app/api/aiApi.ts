import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URI;

export const summaryBlog = async(blogId: number): Promise<void> =>{
    try{
        await axios.post(`${BASE_URL}/ai/summary/${blogId}`);
        console.log(blogId + " AI summary request compled");
    } catch (error) {
        console.error("AI summary request failed:", error);
    }
    throw new Error("An unexpected error occurred");
}