import axios from "axios";


const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URI;


export const getTodayVisitorCount = async() : Promise<number | undefined> => {
	try{
		const response = await axios.get(`${BASE_URL}/visitor/todayCnt`);
		return response.status === 200 ? response.data : undefined;
	}
	catch(error){
		console.error("Error fetching today's user visitor count:",error);
		return undefined;
	}
}

export const getTotalVisitorCount = async(): Promise<number | undefined> => {
	try{
		const response = await axios.get(`${BASE_URL}/visitor/totalCnt`);
		return response.status === 200 ? response.data : undefined;
	}
	catch(error){
		console.error("Error fetching total visitor count:", error);
	}
}
