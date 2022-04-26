export interface StringInterface {
  [x: string]: string;
}

export interface AnyInterface {
  [x: string]: any;
}

export type Optional<T> = T | undefined | null;

export interface Base {
  id: number;
  created_at: Date;
  updated_at: Date;
}

export interface DeleteConfirm {
  confirm: string;
}

export interface BaseResponse<T> {
  message: string;
  body: T;
}

export interface PaginationResponse<T> {
  total: number;
  items: Array<T>;
}

export type SuccessResponse = { success: boolean };

export interface SearchParams {
  query?: string;
  limit?: number;
  previous_id?: number;
}

export interface SearchResponse<T> {
  has_next: boolean;
  items: Array<T>;
}
