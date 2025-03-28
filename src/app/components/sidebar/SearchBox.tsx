"use client";

import { useSelector } from "@/app/store";
import { commonAction } from "@/app/store/common";
import { useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { useDispatch } from "react-redux";
import styled from "styled-components";

interface StyledProps {
	$isDark: boolean;
}

const SearchWrapper = styled.div`
  padding-top: 60px;
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
`;

const SearchIcon = styled(HiSearch)`
  position: absolute;
  left: 10px;
  top:110px;
  transform: translateY(-150%);
  color: #ccc;
  font-size: 20px;
`;

const SearchInput = styled.input<StyledProps>`
  width: 100%;
  height: 38px;
  margin-top:10px;
  margin-bottom: 20px;
  padding: 0 10px 0 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size:14px;
  color: ${(props) => (props.$isDark ? "#eee" : "#333")};
  background-color: ${(props) => (props.$isDark ? "#444" : "fff")};
  transition: background-color 0.3s, border-color 0.3s;

  &:foucs {
    outline: none;
    border-color: #007bff;
    background-color: ${(props) => (props.$isDark ? "#555" : "#f1f1f1")};
  }
`;

export const SearchBox = () => {
	const dispatch = useDispatch();
	const [searchQuery, setSearchQuery] = useState("");
  const isDarkMode = useSelector((state) => state.common.isDark);
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
		setIsDark(isDarkMode);
	}, [isDarkMode]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			dispatch(commonAction.setSearchFilter(searchQuery));
		}, 300); 
		return () => clearTimeout(timeoutId); 
		
	}, [searchQuery, dispatch]);

	return (
		<SearchWrapper>
			<SearchIcon/>
			<SearchInput
				$isDark={isDark}
				placeholder="검색어를 입력하세요"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				/>
		</SearchWrapper>
	)
}