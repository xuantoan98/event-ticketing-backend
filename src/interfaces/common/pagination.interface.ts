export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: 'createdAt' | 'name' | 'email';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
