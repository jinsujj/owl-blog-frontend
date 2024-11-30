import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {CommonState} from "../types/reduxState";

const initialState: CommonState = {
    isDark: false,
    postState: "read",
    toggle: false,
    search: "",
    category: "",
    subCategory: "",
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
        setPostState(state, action: PayloadAction<"write" | "modify" | "read">) {
            state.postState = action.payload;
        },
        setSearchFilter(state, action: PayloadAction<string>){
            state.search = action.payload;
        },
        setCategory(state , action: PayloadAction<string>){
            state.category = action.payload;
        },
        setSubCategory(state, action: PayloadAction<string>){
            state.subCategory = action.payload;
        },
        initCommonState(state){
            state = initialState;
            return state;
        },
    },
});

export const commonAction =  { ...common.actions};
export default common;