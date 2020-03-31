type Layer = 'router' | 'authentication' | 'server' | 'data' | 'database';

export type Response<T = any> = Error | Success<T>;

interface IResponse {
  error: boolean;
  statusCode: number;
}

export interface Success<T> extends IResponse {
  data: T;
}

export interface Error extends IResponse {
  message: string;
  name: string;
  layer: Layer;
}
