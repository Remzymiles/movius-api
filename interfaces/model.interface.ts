import { DateTime } from 'luxon';

export interface Pagination {
  page?: number;
  size?: number;
}

export interface IBaseModel {
  id: number;
  cuid: string;
  created_at: DateTime;
  updated_at: DateTime | null;
}
