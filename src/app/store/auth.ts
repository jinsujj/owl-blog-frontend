import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
    jwtToken: string;
}

const initialState: AuthState={
    jwtToken: '',
}

const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setJwtToken(state, action: PayloadAction<string>){
            state.jwtToken = action.payload;
        },
        clearJwtToken(state){
            state.jwtToken = '';
        }
    }
});

export const authAction = {...auth.actions};
export default auth;