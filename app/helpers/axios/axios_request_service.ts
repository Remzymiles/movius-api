import axios, { Axios, AxiosHeaders, HeadersDefaults, RawAxiosRequestHeaders } from 'axios';

export class AxiosRequestService {
  protected axiosInstance: Axios;

  constructor(baseURL: string, headers?: RawAxiosRequestHeaders | AxiosHeaders | Partial<HeadersDefaults>) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      } as any,
    });
  }
}
