"use client";

import Button from "./components/common/Button";
import Header from "./components/common/Header";
import { setDarkMode, useSelector } from "./store";
import { useDispatch } from 'react-redux';

const HomePage = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.common.isDark);

  const changeDarkMode = () => {
    dispatch(setDarkMode(!isDarkMode));
  };

  return (
    <div>
      <Header />
      <h1>부엉이 개발자 블로그</h1>
      {isDarkMode === true && <h2>저녁 시간이네요</h2>}
      {isDarkMode !== true && <h2>낮 시간이네요</h2>}
      <Button onClick={changeDarkMode} color="green">
        다크모드 변경
      </Button>
    </div>
  );
};

export default HomePage;
