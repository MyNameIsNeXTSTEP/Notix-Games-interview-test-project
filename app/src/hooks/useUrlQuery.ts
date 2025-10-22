import { useState, useEffect, useCallback } from 'react';

export const useUrlQuery = (key: string) => {
  const [value, setValue] = useState<string>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key) || '';
  });

  const updateUrl = useCallback((newValue: string) => {
    const url = new URL(window.location.href);
    
    if (newValue.trim()) {
      url.searchParams.set(key, newValue);
    } else {
      url.searchParams.delete(key);
    }
    
    // Обновляем URL без перезагрузки страницы
    window.history.replaceState({}, '', url.toString());
  }, [key]);

  const setQueryValue = useCallback((newValue: string) => {
    setValue(newValue);
    updateUrl(newValue);
  }, [updateUrl]);

  // Синхронизация с изменениями URL (например, при навигации назад/вперед)
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const newValue = urlParams.get(key) || '';
      setValue(newValue);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [key]);

  return [value, setQueryValue] as const;
};
