export type ApiResponse = {
  ok: boolean;
  status: number;
};

export interface PaginatedResponse<T> {
  rows: Array<T>;
  count: number;
}
