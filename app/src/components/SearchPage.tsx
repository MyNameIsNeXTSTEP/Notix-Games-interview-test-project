import React, { useEffect, useRef } from 'react';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { useSearch } from '../hooks/useSearch';
import { useUrlQuery } from '../hooks/useUrlQuery';

export const SearchPage: React.FC = () => {
  const [urlQuery, setUrlQuery] = useUrlQuery('q');
  const { setQuery, ...search } = useSearch({
    debounceMs: 300,
    minQueryLength: 1
  });

  const hasInitialized = useRef(false);
  const initialUrlQuery = useRef(urlQuery);
  const isInitializing = useRef(false);

  /**
   * Инициализация: загрузка query из URL при первом рендере
   */
  useEffect(() => {
    if (!hasInitialized.current) {
      const initialQuery = initialUrlQuery.current;
      if (initialQuery) {
        isInitializing.current = true;
        setQuery(initialQuery);
      } else {
        hasInitialized.current = true;
      }
    }
  }, [setQuery]);

  /**
   * Отслеживание завершения инициализации
   */
  useEffect(() => {
    if (isInitializing.current && search.query) {
      isInitializing.current = false;
      hasInitialized.current = true;
    }
  }, [search.query]);

  /**
   * Синхронизация: обновление URL при изменении query
   */
  useEffect(() => {
    if (hasInitialized.current && !isInitializing.current) {
      setUrlQuery(search.query);
    }
  }, [search.query, setUrlQuery]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center align-center mt-4">
      <div className="flex flex-col items-center justify-start">
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700">
            Введите запрос и получите мгновенные результаты
          </p>
        </div>

        <div className="w-[600px] px-4">
          <SearchInput
            value={search.inputValue}
            onChange={search.updateInputValue}
            onSearch={setQuery}
            loading={search.loading}
            placeholder='Введите запрос для поиска, например: javascript, react, js...'
            className="w-full"
            debounceMs={300}
          />
        </div>

        <div className="w-full max-w-[900px] px-4" style={{ marginTop: '4rem' }}>
          <SearchResults
            results={search.results}
            loading={search.loading}
            error={search.error}
            total={search.total}
            query={search.query}
          />
        </div>
      </div>
    </div>
  );
};
