"use client";

import Header from "./components/common/Header";
import { setDarkMode, useSelector } from "./store";
import { useDispatch } from 'react-redux';

const initDarkMode = () => {
  const now = new Date();
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60 * 1000; 
  const koreanTimeDiff = 9 * 60 * 60 * 1000;
  const koreaNow = new Date(utcNow + koreanTimeDiff);
  if (18 <= koreaNow.getHours() || koreaNow.getHours() <= 6) return true;

  return false;
};

const HomePage = () => {
  const dispatch = useDispatch();
  dispatch(setDarkMode(initDarkMode()));

  const isDarkMode = useSelector((state) => state.common.isDark);

  return (
    <div>
      <Header />
      <h1>부엉이 개발자 블로그</h1>
      {isDarkMode === true && <h2>저녁 시간이네요</h2>}
      {isDarkMode !== true && <h2>낮 시간이네요</h2>}
    </div>
  );
};

export default HomePage;
