import type { SearchResult, SearchResponse } from '../types/search';

const mockData: SearchResult[] = [
  {
    id: 1,
    title: 'React - A JavaScript library for building user interfaces',
    body: 'React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.',
    userId: 1
  },
  {
    id: 2,
    title: 'TypeScript - JavaScript with syntax for types',
    body: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
    userId: 2
  },
  {
    id: 3,
    title: 'Vite - Next Generation Frontend Tooling',
    body: 'Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.',
    userId: 3
  },
  {
    id: 4,
    title: 'Tailwind CSS - A utility-first CSS framework',
    body: 'Tailwind CSS is a utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.',
    userId: 4
  },
  {
    id: 5,
    title: 'JavaScript - The Programming Language of the Web',
    body: 'JavaScript is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.',
    userId: 5
  },
  {
    id: 6,
    title: 'HTML - HyperText Markup Language',
    body: 'HTML is the standard markup language for documents designed to be displayed in a web browser.',
    userId: 6
  },
  {
    id: 7,
    title: 'CSS - Cascading Style Sheets',
    body: 'CSS is a style sheet language used for describing the presentation of a document written in HTML or XML.',
    userId: 7
  },
  {
    id: 8,
    title: 'Node.js - JavaScript runtime built on Chrome V8',
    body: 'Node.js is a JavaScript runtime built on Chrome V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model.',
    userId: 8
  },
  {
    id: 9,
    title: 'npm - Node Package Manager',
    body: 'npm is the package manager for JavaScript and the world largest software registry.',
    userId: 9
  },
  {
    id: 10,
    title: 'Git - Distributed version control system',
    body: 'Git is a distributed version control system for tracking changes in source code during software development.',
    userId: 10
  }
];


/**
 * Функция для фильтрации данных по запросу
 */
export const filterResults = (query: string): SearchResult[] => {
  if (!query.trim()) return [];
  const lowercaseQuery = query.toLowerCase();
  return mockData.filter(item => 
    item.title.toLowerCase().includes(lowercaseQuery) ||
    item.body.toLowerCase().includes(lowercaseQuery)
  );
};

/**
 * Симуляция API запроса с задержкой
 */
export const searchApi = async (query: string, signal?: AbortSignal): Promise<SearchResponse> => {
  const delay = Math.random() * 1000 + 500;
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      if (signal?.aborted) {
        reject(new Error('Request aborted'));
        return;
      }
      
      const results = filterResults(query);
      resolve({
        results,
        total: results.length,
        query
      });
    }, delay);
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new Error('Request aborted'));
      });
    }
  });
};
