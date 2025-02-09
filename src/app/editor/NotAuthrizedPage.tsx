"use client";

import { useSelector } from '@/app/store';
import React from 'react';
import styled from 'styled-components';

interface StyledProps {
	$isDark: boolean;
}

const Container = styled.div<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1.5rem;
  color: ${(props) => (props.$isDark ? "#eee" : "#333")};
  background-color: ${(props) => (props.$isDark ? "#444" : "#f8f9fa")};
  text-align: center;
`;

export const NotAuthrizedPage = () => {
	const isDarkMode = useSelector((state) => state.common.isDark);
	return (
		<Container $isDark={isDarkMode}>
			해당 기능은 로그인한 유저만 사용 가능합니다.
		</Container>
	)
}
