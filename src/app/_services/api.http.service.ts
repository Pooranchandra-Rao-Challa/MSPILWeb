import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URI_ENDPOINT } from 'src/environments/environment';

@Injectable()
export class ApiHttpService {
  constructor(
    // Angular Modules
    private http: HttpClient
  ) { }
  public get<T>(uri: string, options?: any) {
    return this.http.get<T>(URI_ENDPOINT(uri), options);
  }
  public post<T>(uri: string, data: any, options?: any) {
    return this.http.post<T>(URI_ENDPOINT(uri), data, options);
  }
  public put<T>(uri: string, data: any, options?: any) {
    return this.http.put(URI_ENDPOINT(uri), data, options);
  }
  public delete(uri: string, options?: any) {
    return this.http.delete(URI_ENDPOINT(uri), options);
  }
}
