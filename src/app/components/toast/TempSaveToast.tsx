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
  const isVisible = useSelector((state) => state.common.tempSaveToast.isVisible);
  const [isRendered, setIsRendered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      
      timerRef.current = setTimeout(() => {
        dispatch(hideTempSaveToast());
      }, 3000);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, dispatch]);

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

  if (typeof window === "undefined" || !isRendered ) {
    return null;
  }

  return createPortal(
    <Container $visible={isVisible}>
      임시저장 완료
    </Container>,
    document.getElementById("temp-save-modal") as HTMLElement
  );
}
