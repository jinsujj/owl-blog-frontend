import { api } from "./lib/axios-client";


export const getTodayVisitorCount = async() : Promise<number | undefined> => {
	try{
		const response = await api.get(`/visitor/todayCnt`);
		return response.status === 200 ? response.data : undefined;
	}
	catch(error){
		console.error("Error fetching today's user visitor count:",error);
		return undefined;
	}
}

export const getTotalVisitorCount = async(): Promise<number | undefined> => {
	try{
		const response = await api.get(`/visitor/totalCnt`);
		return response.status === 200 ? response.data : undefined;
	}
	catch(error){
		console.error("Error fetching total visitor count:", error);
	}
}
