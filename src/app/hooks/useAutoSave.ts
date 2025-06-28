import { useEffect, useRef, useCallback, useMemo } from 'react';
import type { OutputData } from '@editorjs/editorjs';
import type EditorJS from '@editorjs/editorjs';

// 태그 타입 정의
interface TagOption {
  name: string;
  label: string;
}

// DraftData 타입을 export하여 재사용 가능하게 만듦
export interface DraftData {
  data: OutputData;
  title: string;
  imageUrl: string;
  selectedTags: TagOption[];
  timestamp: number;
  blogId: number;
}

interface UseAutoSaveProps {
  blogId: number;
  title: string;
  imageUrl: string;
  selectedTags: TagOption[];
  onSave?: () => void;
  onRestore?: (data: DraftData) => void;
}

// localStorage가 사용 가능한지 확인하는 헬퍼 함수
const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export const useAutoSave = ({ 
  blogId, 
  title, 
  imageUrl, 
  selectedTags, 
  onSave, 
  onRestore 
}: UseAutoSaveProps) => {
  const editorRef = useRef<EditorJS | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');
  const isEditorReadyRef = useRef<boolean>(false);
  const isTypingRef = useRef<boolean>(false);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 스토리지 키를 메모이제이션
  const storageKey = useMemo(() => `draft_${blogId}`, [blogId]);

  // saveToLocalStorage를 안정적으로 메모이제이션
  const saveToLocalStorage = useCallback((data: OutputData) => {
    if (!isLocalStorageAvailable()) return;
    
    const saveData: DraftData = {
      data,
      title,
      imageUrl,
      selectedTags,
      timestamp: Date.now(),
      blogId
    };
    
    localStorage.setItem(storageKey, JSON.stringify(saveData));
    lastSavedDataRef.current = JSON.stringify(data);
    
    if (onSave) {
      onSave();
    }
  }, [title, imageUrl, selectedTags, blogId, storageKey, onSave]);

  // loadFromLocalStorage를 안정적으로 메모이제이션
  const loadFromLocalStorage = useCallback((): DraftData | null => {
    if (!isLocalStorageAvailable()) return null;
    
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  }, [storageKey]);

  // clearLocalStorage를 안정적으로 메모이제이션
  const clearLocalStorage = useCallback(() => {
    if (!isLocalStorageAvailable()) return;
    
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  // autoSave를 안정적으로 메모이제이션
  const autoSave = useCallback(() => {
    // 1. 에디터가 존재하는지 확인
    if (!editorRef.current) {
      return;
    }

    // 2. 에디터가 준비되었는지 확인
    if (!isEditorReadyRef.current) {
      return;
    }

    // 3. 타이핑 중인지 확인
    if (isTypingRef.current) {
      return;
    }

    // 4. save 메서드가 있는지 확인
    if (typeof editorRef.current.save !== 'function') {
      return;
    }

    // 5. 실제 저장 실행
    editorRef.current.save().then((data: OutputData) => {
      const currentData = JSON.stringify(data);
      if (currentData !== lastSavedDataRef.current) {
        saveToLocalStorage(data);
      }
    }).catch((error: Error) => {
      console.warn('AutoSave: Save failed:', error);
    });
  }, [saveToLocalStorage]);

  // setEditorReady를 안정적으로 메모이제이션
  const setEditorReady = useCallback((ready: boolean) => {
    isEditorReadyRef.current = ready;
    
    // 에디터가 준비되면 자동 저장 시작
    if (ready && !autoSaveIntervalRef.current) {
      autoSaveIntervalRef.current = setInterval(autoSave, 5000);
    } else if (!ready && autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
      autoSaveIntervalRef.current = null;
    }
  }, [autoSave]);

  // setEditorRef를 안정적으로 메모이제이션
  const setEditorRef = useCallback((editor: EditorJS | null) => {
    editorRef.current = editor;
  }, []);

  // setTypingState를 안정적으로 메모이제이션
  const setTypingState = useCallback((isTyping: boolean) => {
    isTypingRef.current = isTyping;
  }, []);

  // 초기 로드 시 로컬 스토리지 데이터 복원 (의존성 최소화)
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData && onRestore) {
      onRestore(savedData);
    }
  }, [loadFromLocalStorage, onRestore]);

  // 페이지 이탈 시 저장 (의존성 최소화)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleBeforeUnload = () => {
      autoSave();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [autoSave]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    autoSave,
    setEditorReady,
    setEditorRef,
    setTypingState,
    isEditorReady: isEditorReadyRef.current
  };
}; 