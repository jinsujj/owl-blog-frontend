import { useEffect, useRef, useCallback, useMemo } from "react";
import type { OutputData } from "@editorjs/editorjs";
import { useDispatch } from "react-redux";
import type EditorJS from "@editorjs/editorjs";
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
  const isFirstSaveRef = useRef<boolean>(true);
  const storageKey = useMemo(() => `draft_${blogId}`, [blogId]);

  const saveToLocalStorage = useCallback(
    (data: OutputData) => {
      if (typeof window === "undefined") return;
      const saveData: DraftData = { data, imageUrl, timestamp: Date.now(), blogId };
      localStorage.setItem(storageKey, JSON.stringify(saveData));
      lastSavedDataRef.current = JSON.stringify(data);
      if (!isFirstSaveRef.current) {
        dispatch(showTempSaveToast());
        setTimeout(() => dispatch(hideTempSaveToast()), 2000);
      } else {
        isFirstSaveRef.current = false;
      }
    },
    [blogId, imageUrl, storageKey, dispatch]
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
    const editor = editorRef.current;
    if (!editor || !isEditorReadyRef.current || isTypingRef.current) return;
    editor.save().then((data: OutputData) => {
      const json = JSON.stringify(data);
      if (json !== lastSavedDataRef.current) {
        saveToLocalStorage(data);
        console.log("임시저장 완료");
      }
    }).catch(err => console.warn("AutoSave Error:", err));
  }, [saveToLocalStorage]);

  const setEditorReady = useCallback((ready: boolean) => {
    isEditorReadyRef.current = ready;
    if (ready) {
      const saved = loadFromLocalStorage();
      if (saved) {
        onRestore?.(saved);
        lastSavedDataRef.current = JSON.stringify(saved.data);
        // 복원 후 첫 저장만 스킵
        isFirstSaveRef.current = true;
      }
    }
  }, [loadFromLocalStorage, onRestore]);

  const setTypingState = useCallback((typing: boolean) => {
    isTypingRef.current = typing;
    if (typing) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    } else {
      typingTimeoutRef.current = setTimeout(autoSave, 2000);
    }
  }, [autoSave]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.isReady
      .then(() => {
        setEditorReady(true);
        editor.on("change", () => setTypingState(true));
      })
      .catch(console.warn);
    return () => {
      editor.isReady
        .then(() => editor.off("change", () => setTypingState(true)))
        .catch(() => {});
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [setEditorReady, setTypingState]);

  useEffect(() => {
    const handler = () => autoSave();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [autoSave]);

  return {
    setEditorRef: (editor: EditorJS | null) => (editorRef.current = editor),
    setEditorReady,
    setTypingState,
    clearLocalStorage,
    autoSave,
    loadFromLocalStorage,
    isEditorReady: isEditorReadyRef.current,
  };
};
