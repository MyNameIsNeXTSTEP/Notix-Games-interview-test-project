import { useState, useEffect, useCallback, useRef } from 'react';
import type { SearchState } from '../types/search';
import { searchApi } from '../api/searchApi';

interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
}

/**
 * @todo
 * Можно сделать лучше, поэтому сейчас пока оставляем для быстрого MVP такой вариант.
 * Например можно отрефакторить так:
 * 1. Сделать новый хук и использовать - useDebounce для debounce
 * 2. Облегчить логику поиска - логику поиска и обработки отмены
 * 3. Декомпозировать update операцию на отдельные функции
 */
export const useSearch = (options: UseSearchOptions = {}) => {
  const { debounceMs = 300, minQueryLength = 1 } = options;
  
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    loading: false,
    error: null,
    total: 0
  });

  // Отдельное состояние для ввода (без debounce)
  const [inputValue, setInputValue] = useState('');

  const currentRequestRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Функция для выполнения поиска
  const performSearch = useCallback(async (query: string) => {
    // Отменяем предыдущий запрос, если он еще выполняется
    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }
    // Создаем новый AbortController для текущего запроса
    const abortController = new AbortController();
    currentRequestRef.current = abortController;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await searchApi(query, abortController.signal);
      
      // Проверяем, не был ли запрос отменен
      if (abortController.signal.aborted) {
        return;
      }

      setState(prev => ({
        ...prev,
        results: response.results,
        total: response.total,
        loading: false,
        error: null
      }));
    } catch (error) {
      // Игнорируем ошибки отмены запроса
      if (error instanceof Error && error.message === 'Request aborted') {
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Произошла ошибка при поиске'
      }));
    }
  }, []);

  // Функция для обновления ввода (без debounce)
  const updateInputValue = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  // Функция для обновления запроса с debounce
  const setQuery = useCallback((query: string) => {
    setInputValue(query);
    setState(prev => ({ ...prev, query }));

    // Очищаем предыдущий debounce таймер
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Если запрос слишком короткий, очищаем результаты
    if (query.length < minQueryLength) {
      setState(prev => ({
        ...prev,
        results: [],
        total: 0,
        loading: false,
        error: null
      }));
      return;
    }

    // Устанавливаем новый debounce таймер
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, debounceMs);
  }, [performSearch, debounceMs, minQueryLength]);

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    inputValue,
    setQuery,
    updateInputValue,
    clearResults: () => {
      setState(prev => ({
        ...prev,
        results: [],
        total: 0,
        query: '',
        error: null
      }));
      setInputValue('');
    }
  };
};
