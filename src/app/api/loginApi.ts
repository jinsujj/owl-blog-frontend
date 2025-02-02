import axios from 'axios';

const BASE_URL = 'http://localhost:8080';


export const requestKakaoLogin = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

    window.location.href = KAKAO_AUTH_URL;
}

export const getKakaoToken = async (code: string): Promise<string | null> => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/kakao/login`, { code }, {withCredentials: true}
        );
        return response.data;
    }
    catch (error) {
        console.error("Error getting kakao token:", error);
        return null;
    }
}

export const checkLoginStatus = async (): Promise<boolean> => {
    try {
        const response = await axios.get(`${BASE_URL}/auth/kakao/login/status`, {withCredentials: true});
        return response.data.isLoggedIn;
    } catch (error) {
        console.error("Error checking login status:", error);
        return false;
    }
};

export const logout = async (): Promise<boolean> => {
    try {
        await axios.post(`${BASE_URL}/auth/kakao/logout`, {}, {withCredentials: true});
        return true;
    } catch (error) {
        console.error("Error during logout:", error);
        return false;
    }
};