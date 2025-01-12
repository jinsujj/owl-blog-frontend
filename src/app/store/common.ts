import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {CommonState} from "../types/reduxState";

const initDarkMode = () => {
    const now = new Date();
    const utcNow = now.getTime() + now.getTimezoneOffset() * 60 * 1000; 
    const koreanTimeDiff = 9 * 60 * 60 * 1000;
    const koreaNow = new Date(utcNow + koreanTimeDiff);
    if (18 <= koreaNow.getHours() || koreaNow.getHours() <= 6) 
        return true;
  
    return false;
  };
  

const initialState: CommonState = {
    isLogged: false,
    isDark: initDarkMode(),
    postState: "read",
    toggle: false,
    search: "",
};


const common = createSlice({
    name: "common",
    initialState,
    reducers: {
        setLogged(state, action: PayloadAction<boolean>){
            state.isLogged = action.payload;
        },
        setToggle(state, action: PayloadAction<boolean>){
            state.toggle = action.payload;
        },
        setDarkMode(state , action: PayloadAction<boolean>){
            state.isDark = action.payload;
        },
        setPostState(state, action: PayloadAction<"write" | "modify" | "read">) {
            state.postState = action.payload;
        },
        setSearchFilter(state, action: PayloadAction<string>){
            state.search = action.payload;
        },
        initCommonState(state){
            state = initialState;
            return state;
        },
    },
});

export const commonAction =  { ...common.actions};
export default common;