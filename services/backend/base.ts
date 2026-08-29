export const BASE_URL = process.env.NEXT_PUBLIC_MASTER || '';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
