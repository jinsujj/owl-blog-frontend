import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export type UserInfo ={
  id: string,
	userName: string,
	imageUrl?: string,
  email?: string
}

export const requestKakaoLogin = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

    window.location.href = KAKAO_AUTH_URL;
}

export const getKakaoToken = async (code: string): Promise<boolean> => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/kakao/login`, { code }, {withCredentials: true});
        return response.status === 200;
    }
    catch (error) {
        console.error("Error getting kakao token:", error);
        return false;
    }
}

export const getKakaoUserInfo = async (): Promise<UserInfo | undefined> => {
  try{
    const response = await axios.get(`${BASE_URL}/auth/token/decode`, {withCredentials: true});
    if (response.status === 200) 
      return response.data;
  }
  catch(error){
    console.error("Error getting user Info", error);
  }
}

export const checkTokenValidity = async ():Promise<boolean> => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/token/validate`, {withCredentials: true});

    if (response.status === 200 && response.data.isValid) {
      return true;
    }
  } catch (error) {
    console.error("Error checking token validity:", error);
  }
  return false; 
};

export const logout = async (): Promise<boolean> => {
    try {
        await axios.post(`${BASE_URL}/auth/logout`, {}, {withCredentials: true});
        return true;
    } catch (error) {
        console.error("Error during logout:", error);
        return false;
    }
};