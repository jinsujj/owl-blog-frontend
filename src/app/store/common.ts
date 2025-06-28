import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {CommonState} from "../types/reduxState";

const initialState: CommonState = {
    isDark: false,
    postId: 0,
    postState: "created",
    toggle: true,
    search: "",
    renderTab: "글",
    tempSaveToast: {
        isVisible: false,
    },
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
        showTempSaveToast(state) {
            state.tempSaveToast.isVisible = true;
        },
        hideTempSaveToast(state) {
            state.tempSaveToast.isVisible = false;
        },
    },
});

export const commonAction =  { ...common.actions};
export default common;