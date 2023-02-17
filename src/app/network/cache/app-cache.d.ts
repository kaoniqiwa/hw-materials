export declare class AppCache {
  constructor(maxAge: number);
  get<T>(key: string): T;
  set<T>(key: string, value: T): void;
  del(key: string): void;
  reset(): void;
}
