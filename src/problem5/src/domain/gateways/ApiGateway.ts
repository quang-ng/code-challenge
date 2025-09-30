export interface ApiGateway {
  get<T = unknown>(url: string, headers?: Record<string, string>): Promise<T>;
  post<T = unknown>(url: string, body: unknown, headers?: Record<string, string>): Promise<T>;
}

