import { api } from './lib/axios-client';


export const summaryBlog = async(blogId: number): Promise<void> =>{
    try{
        await api.post(`/ai/summary/${blogId}`);
        console.log(blogId + " AI summary request compled");
    } catch (error) {
        console.error("AI summary request failed:", error);
    }
    throw new Error("An unexpected error occurred");
}