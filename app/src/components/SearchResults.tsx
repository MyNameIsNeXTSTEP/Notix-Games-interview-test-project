import React from 'react';
import type { SearchResult } from '../types/search';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  total: number;
  query: string;
  className?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  error,
  total,
  query,
  className = ''
}) => {
  /**
   * Функция для подсветки найденного текста
   */
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-300 font-bold text-gray-900" style={{ padding: '2px 4px' }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="bg-white border border-red-300 rounded-lg p-6 shadow">
          <span className="text-red-900 font-semibold text-xl">Ошибка поиска</span>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-12">
          <span className="text-gray-600 text-lg animate-pulse">Поиск...</span>
        </div>
      </div>
    );
  }

  if (!query.trim()) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Ничего не найдено</h3>
          <p className="text-gray-600">
            По запросу <span className="font-semibold">"{query}"</span> ничего не найдено
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Заголовок с количеством результатов */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-3">
          <h2 className="text-3xl font-semibold text-gray-800">
            Найдено: {total}
          </h2>
          {total > 0 && (
            <div className="text-base text-gray-600">
              {total === 1 ? '1 результат' : `${total} результатов`}
            </div>
          )}
        </div>
        <p className="text-base text-gray-700">
          По запросу: <span className="font-normal text-gray-800">"{query}"</span>
        </p>
      </div>

      {/* Список результатов */}
      <div className="space-y-6">
        {results.map((result, index) => (
          <div
            key={result.id}
            className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              boxShadow: '0 0 2px rgba(0, 0, 0, 0.5)',
              marginBottom: '24px'
            }}
          >
            {/* Заголовок карточки */}
            <h3 className="text-xl font-normal mb-2 leading-snug">
              <span className="text-blue-600">{highlightText(result.title.split(' - ')[0] || result.title, query)}</span>
              {result.title.includes(' - ') && (
                <>
                  <span className="text-gray-900"> - </span>
                  <span className="text-gray-900">{highlightText(result.title.split(' - ').slice(1).join(' - '), query)}</span>
                </>
              )}
            </h3>
            
            {/* URL */}
            <a 
              href={`https://reactjs.org`} 
              className="text-blue-600 hover:underline text-sm mb-3 inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://reactjs.org
            </a>
            
            {/* Описание */}
            <p className="text-gray-700 leading-relaxed mb-4 text-base">
              {highlightText(result.body, query)}
            </p>
            
            {/* Метаданные (можно убрать в будущем ?) */}
            <div className="flex items-center gap-8 text-sm text-gray-600">
              <span>
                ID: {result.id}
              </span>
              <span>
                Пользователь: {result.userId}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
