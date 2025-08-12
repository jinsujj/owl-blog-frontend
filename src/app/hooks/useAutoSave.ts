"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import type { OutputData } from "@editorjs/editorjs";
import type EditorJS from "@editorjs/editorjs";
import { useDispatch } from "react-redux";
import { showTempSaveToast, hideTempSaveToast } from "../store";

export interface TagOption {
  name: string;
  label: string;
}

export interface DraftData {
  data: OutputData;
  imageUrl: string;
  timestamp: number;
  blogId: number;
}

interface UseAutoSaveProps {
  blogId: number;
  imageUrl: string;
  onRestore?: (data: DraftData) => void;
}

export const useAutoSave = ({
  blogId,
  imageUrl,
  onRestore,
}: UseAutoSaveProps) => {
  const dispatch = useDispatch();

  const editorRef = useRef<EditorJS | null>(null);
  const lastSavedDataRef = useRef<string>("");
  const isEditorReadyRef = useRef<boolean>(false);
  const isTypingRef = useRef<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = useMemo(() => `draft_${blogId}`, [blogId]);
  const isSuspendedRef = useRef(false);
  const restoredRef = useRef(false); // 복구 1회 제한

  /** 자동저장 일시중지 */
  const suspendAutoSave = useCallback(() => {
    isSuspendedRef.current = true;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  /** 자동저장 재개 */
  const resumeAutoSave = useCallback(() => {
    isSuspendedRef.current = false;
  }, []);

  /** 로컬 스토리지 저장 */
  const saveToLocalStorage = useCallback(
    (data: OutputData) => {
      if (typeof window === "undefined" || isSuspendedRef.current) return;

      const saveData: DraftData = {
        data,
        imageUrl,
        timestamp: Date.now(),
        blogId,
      };

      localStorage.setItem(storageKey, JSON.stringify(saveData));
      lastSavedDataRef.current = JSON.stringify(data);

      dispatch(showTempSaveToast());
      setTimeout(() => {
        dispatch(hideTempSaveToast());
      }, 2000);
    },
    [blogId, imageUrl, storageKey, dispatch]
  );

  /** 로컬 스토리지 로드 */
  const loadFromLocalStorage = useCallback((): DraftData | null => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  }, [storageKey]);

  /** 로컬 스토리지 삭제 (타이머/재저장 방지 포함) */
  const clearLocalStorage = useCallback(() => {
    if (typeof window === "undefined") return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    // 현재 에디터 상태를 마지막 저장값으로 맞춰 재저장 방지
    if (editorRef.current && typeof editorRef.current.save === "function") {
      editorRef.current.save().then((data) => {
        lastSavedDataRef.current = JSON.stringify(data);
        localStorage.removeItem(storageKey);
      }).catch(() => {
        localStorage.removeItem(storageKey);
      });
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  /** 자동저장 실행 */
  const autoSave = useCallback(() => {
    if (isSuspendedRef.current) return;
    if (!editorRef.current || !isEditorReadyRef.current || isTypingRef.current) return;
    if (typeof editorRef.current.save !== "function") return;

    editorRef.current
      .save()
      .then((data: OutputData) => {
        const currentData = JSON.stringify(data);
        if (!isSuspendedRef.current && currentData !== lastSavedDataRef.current) {
          saveToLocalStorage(data);
        }
      })
      .catch((err) => console.warn("AutoSave:", err));
  }, [saveToLocalStorage]);

  /** 에디터 준비 상태 세팅 */
  const setEditorReady = useCallback((ready: boolean) => {
    isEditorReadyRef.current = ready;
  }, []);

  /** 에디터 ref 세팅 */
  const setEditorRef = useCallback((editor: EditorJS | null) => {
    editorRef.current = editor;
  }, []);

  /** 타이핑 상태 변경 */
  const setTypingState = useCallback(
    (isTyping: boolean) => {
      if (isSuspendedRef.current) return; // 중단 중엔 무시
      isTypingRef.current = isTyping;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (!isTyping) {
        typingTimeoutRef.current = setTimeout(autoSave, 5000);
      }
    },
    [autoSave]
  );

  /** 초기 복구 */
  useEffect(() => {
    if (restoredRef.current) return;
    const saved = loadFromLocalStorage();
    if (saved) {
      restoredRef.current = true;
      onRestore?.(saved);
    }
  }, [loadFromLocalStorage, onRestore]);

  /** 페이지 이탈 시 자동저장 */
  useEffect(() => {
    const handler = () => autoSave();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [autoSave]);

  /** 언마운트 시 타이머 해제 */
  useEffect(
    () => () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    },
    []
  );

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    autoSave,
    setEditorReady,
    setEditorRef,
    setTypingState,
    suspendAutoSave,   // 외부에서 자동저장 중단 가능
    resumeAutoSave,    // 필요 시 재개
    isEditorReady: isEditorReadyRef.current,
  };
};
