import React, { useEffect, useRef } from 'react';
import { ClearButton } from './ClearButton';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  loading = false,
  placeholder,
  className = '',
  debounceMs = 300
}) => {
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    // Очищаем предыдущий debounce таймер
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    // Устанавливаем новый debounce таймер для поиска
    if (onSearch) {
      debounceTimeoutRef.current = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);
    }
  };

  const handleClear = () => {
    onChange('');
    if (onSearch) {
      onSearch('');
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-stretch rounded-full overflow-hidden" style={{ boxShadow: '0 0 2px rgba(0, 0, 0, 0.2)' }}>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 text-base focus:outline-none bg-white placeholder-gray-400 min-h-[48px] border-0"
          disabled={loading}
          autoComplete="off"
          spellCheck="false"
        />

        {value && !loading && (
          <ClearButton onClick={handleClear} />
        )}
        
        {!value && (
          <div className="w-12 bg-white"></div>
        )}
      </div>
    </div>
  );
};
