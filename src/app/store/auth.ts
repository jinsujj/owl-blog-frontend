import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState : {authMode: "signup" | "login"} ={
    authMode: "signup",
}

const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthMode(state, acition: PayloadAction<"signup"|"login">){
            state.authMode = acition.payload;
        }
    }
});

export const authAction = {...auth.actions};
export default auth;