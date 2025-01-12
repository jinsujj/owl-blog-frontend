import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux";
import common from "./common";
import auth from "./auth";

const rootReducer = {
    common: common.reducer,
		auth: auth.reducer,
};

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false
        })
});

// RootState 타입 정의 - 전체 Redux 상태의 타입
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch 타입 정의 - 디스패치 함수의 타입
export type AppDispatch = typeof store.dispatch;

// 타입이 지정된 useSelector 훅
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

// 공통 액션들을 외부에서 쉽게 import할 수 있도록 export
export const { setToggle, setDarkMode, setPostState, setSearchFilter, initCommonState } = common.actions;