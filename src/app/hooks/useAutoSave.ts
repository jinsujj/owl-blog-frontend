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
  title: string;
  imageUrl: string;
  selectedTags: TagOption[];
  onRestore?: (data: DraftData) => void;
  onTempSaveComplete?: () => void;
}

export const useAutoSave = ({
  blogId,
  title,
  imageUrl,
  selectedTags,
  onRestore,
  onTempSaveComplete,
}: UseAutoSaveProps) => {
  const dispatch = useDispatch();

  const editorRef = useRef<EditorJS | null>(null);
  const lastSavedDataRef = useRef<string>("");
  const isEditorReadyRef = useRef<boolean>(false);
  const isTypingRef = useRef<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const storageKey = useMemo(() => `draft_${blogId}`, [blogId]);

  const saveToLocalStorage = useCallback(
    (data: OutputData) => {
      if (typeof window === "undefined") return;

      const saveData: DraftData = {data,imageUrl,timestamp: Date.now(),blogId};

      localStorage.setItem(storageKey, JSON.stringify(saveData));
      lastSavedDataRef.current = JSON.stringify(data);

      if (onTempSaveComplete) {
        onTempSaveComplete();
      } else {
        dispatch(showTempSaveToast());
        setTimeout(() => {
          dispatch(hideTempSaveToast());
        }, 2000);
      }
    },
    [
      blogId,
      title,
      imageUrl,
      selectedTags,
      storageKey,
      onTempSaveComplete,
      dispatch,
    ]
  );

  const loadFromLocalStorage = useCallback((): DraftData | null => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  }, [storageKey]);

  const clearLocalStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const autoSave = useCallback(() => {
    if (!editorRef.current || !isEditorReadyRef.current || isTypingRef.current)
      return;
    if (typeof editorRef.current.save !== "function") return;

    editorRef.current
      .save()
      .then((data: OutputData) => {
        const currentData = JSON.stringify(data);
        if (currentData !== lastSavedDataRef.current) {
          saveToLocalStorage(data);
          console.log("임시저장 완료");
        }
      })
      .catch((err) => console.warn("AutoSave:", err));
  }, [saveToLocalStorage]);

  const setEditorReady = useCallback((ready: boolean) => {
    isEditorReadyRef.current = ready;
  }, []);

  const setEditorRef = useCallback((editor: EditorJS | null) => {
    editorRef.current = editor;
  }, []);

  const setTypingState = useCallback(
    (isTyping: boolean) => {
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

  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved) onRestore?.(saved);
  }, [loadFromLocalStorage, onRestore]);

  useEffect(() => {
    const handler = () => autoSave();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [autoSave]);

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
    isEditorReady: isEditorReadyRef.current,
  };
};
