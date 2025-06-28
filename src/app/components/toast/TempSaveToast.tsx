"use client";

import { useSelector } from "@/app/store";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes, css } from "styled-components";
import { usePathname } from "next/navigation";

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
          ${slideOut} 0.3s ease-in forwards 3s
        `};
`;

export default function TempSaveToast() {
  const isLogged = useSelector((state) => state.auth.isLogged);
  const isVisible = useSelector((state) => state.common.tempSaveToast.isVisible);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const pathname = usePathname();

  // 현재 페이지가 에디터 페이지인지 확인
  const isEditorPage = pathname === "/editor";
  const isBlogDetailPage = pathname.startsWith("/blog/");

  useEffect(() => {
    if (typeof window === "undefined") return;
    let container = document.querySelector("#temp-save-modal") as HTMLElement;
    if (!container) {
      container = document.createElement("div");
      container.id = "temp-save-modal";
      document.body.appendChild(container);
    }
    setPortalContainer(container);
    return () => {
      if (container.childNodes.length === 0) container.remove();
    };
  }, []);

  if (!portalContainer || (!isEditorPage && !isBlogDetailPage)) return null;

  return createPortal(
    <Container $visible={isLogged && isVisible}>
      임시저장 완료
    </Container>,
    portalContainer
  );
}
