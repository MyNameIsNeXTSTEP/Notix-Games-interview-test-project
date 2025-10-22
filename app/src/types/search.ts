export interface SearchResult {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  total: number;
}
