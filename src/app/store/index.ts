import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux";
import common from "./common";


const rootReducer= combineReducers({
    common: common.reducer,
})

export type RootState = ReturnType<typeof rootReducer>;

const reducer = (state: RootState | undefined, action: AnyAction): RootState => {
    if(action.type == HYDRATE ){
        const nextState = {
            ...state,               // 기존 상태를 유지
            ...action.payload,      // hydration으로 들어온 변화를 적용
        }
        return nextState;
    }
    else {
        return rootReducer(state, action)
    }
}

export const useSelector : TypedUseSelectorHook<RootState> = useReduxSelector;

const initStore = () => {
    const store = configureStore({
        reducer,
        devTools: process.env.NODE_ENV !== 'production',
    });
    return store;
}

export const wrapper = createWrapper(initStore);