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
    isDark: initDarkMode(),
    postId: 0,
    postState: "created",
    toggle: true,
    search: "",
		renderTab: "글"
};


const common = createSlice({
    name: "common",
    initialState,
    reducers: {
        setToggle(state, action: PayloadAction<boolean>){
            state.toggle = action.payload;
        },
        setDarkMode(state , action: PayloadAction<boolean>){
            state.isDark = action.payload;
        },
        setPostId(state, action:PayloadAction<number>){
            state.postId = action.payload;
        },
        setPostState(state, action: PayloadAction<"created" | "modify" | "published">) {
            state.postState = action.payload;
        },
				setRenderTab(state, action: PayloadAction<"글"|"시리즈"|"소개">){
					state.renderTab = action.payload;
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