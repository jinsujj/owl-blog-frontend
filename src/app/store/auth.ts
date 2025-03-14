import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
    isLogged: boolean;
    id: string;
    userName: string;
    imageUrl?: string;
    email?: string;
}

const initialState: AuthState={
    isLogged: false,
    id: '',
    userName: '',
    imageUrl: '',
    email: '',
}

const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogged(state, action: PayloadAction<boolean>){
            state.isLogged = action.payload;
        },
        setUserId(state, action: PayloadAction<string>){
            state.id = action.payload;
        },
        setUserName(state, action: PayloadAction<string>){
            state.userName = action.payload;
        },
        setImageUrl(state, action: PayloadAction<string>){
            state.imageUrl = action.payload;
        },
        setEmail(state, action: PayloadAction<string>){
            state.email = action.payload;
        },
        setLogout(state) {
            Object.assign(state, initialState);
        }
    }
});

export const authAction = {...auth.actions};
export default auth;