import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response, Success, Error } from './response.model';

const API = 'https://dixitserver.herokuapp.com';

/**
 * A helper class to provide a comfortable interface for accessing the API
 * Promise driven.
 */
export class Request<ResultType = any> {
  private url: string;
  private method: string;
  private data: string;

  private http: HttpClient;
  private headers: HttpHeaders;
  constructor(http: HttpClient) {
    this.http = http;
  }

  public get(url: string): Promise<ResultType> {
    this.url = url;
    this.method = 'get';
    return new Promise((resolve, reject) => {
      this.http.get<Response<ResultType>>(API + url, { headers: this.headers })
      .toPromise()
      .then(res => {this.success(res, resolve, reject); })
      .catch(err => { this.fail(err, reject); });
    });
  }

  public post(url: string, data: any = {}): Promise<ResultType> {
    this.url = url;
    this.method = 'post';
    this.data = data;
    return new Promise((resolve, reject) => {
      this.http.post<Response<ResultType>>(API + url, data, { headers: this.headers })
      .toPromise()
      .then(res => {this.success(res, resolve, reject); })
      .catch(err => { this.fail(err, reject); });
    });
  }

  public patch(url: string, data: any = {}): Promise<ResultType> {
    this.url = url;
    this.method = 'patch';
    this.data = data;
    return new Promise((resolve, reject) => {
      this.http.patch<Response<ResultType>>(API + url, data, { headers: this.headers })
      .toPromise()
      .then(res => {this.success(res, resolve, reject); })
      .catch(err => { this.fail(err, reject); });
    });
  }

  public put(url: string, data: any = {}): Promise<ResultType> {
    this.url = url;
    this.method = 'put';
    this.data = data;
    return new Promise((resolve, reject) => {
      this.http.put<Response<ResultType>>(API + url, data, { headers: this.headers })
      .toPromise()
      .then(res => {this.success(res, resolve, reject); })
      .catch(err => { this.fail(err, reject); });
    });
  }

  public delete(url: string): Promise<ResultType> {
    this.url = url;
    this.method = 'delete';
    return new Promise((resolve, reject) => {
      this.http.delete<Response>(API + url, { headers: this.headers })
      .toPromise()
      .then(res => {this.success(res, resolve, reject); })
      .catch(err => { this.fail(err, reject); });
    });
  }

  private success(result: Response, resolve, reject) {
    if (result.error) return reject((result as Error).message);
    resolve((result as Success<ResultType>).data);
  }

  private fail(result: Error, reject) {
    console.log(result);
    console.log(this);

    if (result.message) reject(result.message);
    else reject({ message: 'Request failed' });
  }
}
