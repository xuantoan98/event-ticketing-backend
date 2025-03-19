interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  token?: string;
  meta?: any;
}

export const formatResponse = <T>(
  status: 'success' | 'error',
  message: string,
  data?: T,
  token?: string,
  meta?: any
): ApiResponse<T> => ({
  status,
  message: message,
  ...(data && { data }),
  ...(token && { token }),
  ...(meta && { meta })
});
