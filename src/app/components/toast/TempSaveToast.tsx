"use client";

import { hideTempSaveToast, useSelector } from "@/app/store";
import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes, css } from "styled-components";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";

const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);   opacity: 1; }
`;
const slideOut = keyframes`
  from { transform: translateX(0);   opacity: 1; }
  to   { transform: translateX(100%);opacity: 0; }
`;

const Container = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  display: inline-flex;
  align-items: center;
  background: #4caf50;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.2);
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(6px);

  &::before {
    content: "✔";
    display: inline-block;
    margin-right: 6px;
    font-size: 14px;
    line-height: 1;
  }

  animation: ${({ $visible }) =>
    $visible
      ? css`
          ${slideIn} 0.3s ease-out forwards
        `
      : css`
          ${slideOut} 0.3s ease-in forwards
        `};
  display: ${({ $visible }) => ($visible ? 'inline-flex' : 'none')};
`;

export default function TempSaveToast() {
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.auth.isLogged);
  const isVisible = useSelector((state) => state.common.tempSaveToast.isVisible);
  const [isRendered, setIsRendered] = useState(false);
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 현재 페이지가 에디터 페이지인지 확인
  const isEditorPage = pathname === "/editor";
  const isBlogDetailPage = pathname.startsWith("/blog/");

  // 상태 변화 감지 및 자동 숨김 처리
  useEffect(() => {
    // 로그인 상태가 아니면 토스트 표시하지 않음
    if (!isLogged) {
      setIsRendered(false);
      return;
    }

    if (isVisible) {
      setIsRendered(true);
      
      // 3초 후에 토스트 숨기기
      timerRef.current = setTimeout(() => {
        dispatch(hideTempSaveToast());
      }, 3000);
    } else {
      // 애니메이션 종료 후 완전히 사라지도록 지연 처리
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, isLogged, dispatch]);

  // 포털 컨테이너 설정
  useEffect(() => {
    if (typeof window === "undefined") return;

    let container = document.getElementById("temp-save-modal");
    if (!container) {
      container = document.createElement("div");
      container.id = "temp-save-modal";
      document.body.appendChild(container);
    }
    
    return () => {
      if (container && container.childElementCount === 0) {
        container.remove();
      }
    };
  }, []);

  // 로그인 상태가 아니면 무조건 렌더링하지 않음
  if (typeof window === "undefined" || 
      !isRendered || 
      !isLogged || // isLogged가 false면 무조건 숨김
      (!isEditorPage && !isBlogDetailPage)) {
    return null;
  }

  return createPortal(
    <Container $visible={isVisible}>
      임시저장 완료
    </Container>,
    document.getElementById("temp-save-modal") as HTMLElement
  );
}
