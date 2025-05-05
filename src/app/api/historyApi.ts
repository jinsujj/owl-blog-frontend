import { api } from "./lib/axios-client";

export interface CoordinateVO {
	blogTitle: string;
    blogId: string;
	country: string;
	city: string;
	ip: string;
	createdAt: string;
	lat: string;
	lon: string;
  }

export const getVisitorCoordinatesHistory = async (
	from: string,
	to: string,
	ipAddress?: string
  ): Promise<CoordinateVO[] | undefined> => {
	try {
	  const response = await api.get(`/visitor/coordinate/history`, {
		params: {from,to,...(ipAddress ? { ip: ipAddress } : {}),
		  },
	  });
  
	  return response.status === 200 ? response.data : undefined;
	} catch (error) {
	  console.error("Error fetching visitor coordinates history:", error);
	  return undefined;
	}
  };

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
