export type AdapterManagement<T> = {
  [P in keyof T]: T[P];
} & { adapter: T };
