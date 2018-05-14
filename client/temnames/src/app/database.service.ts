import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandler, HttpInterceptor, HttpHeaders, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';


@Injectable()
export class DatabaseService {
  readonly URL = "http://localhost:8081";
  readonly ENDPOINTS = [
    'status','crossmatch','scoreCrossmatch','collection','data'
  ]

  constructor(private http : HttpClient) {
    this.loading = new Subject();
    // hobs.loading.subscribe(b=>this.loading.next(b));
  }

  public data() {
    let v = { element : { subelement : 'dummy'}};
    return v;
  }

  public loading : Subject<boolean>;

  public upload(name: string, namefield: string, file: File) : Observable<DatabaseApiResponse> {
    const data = new FormData();
    data.set('namefield', namefield);
    data.set('sheet', 'Data 1');
    data.set('file', file);
		//const headers = new HttpHeaders({'Content-Type': 'multipart/form-data'});
		//return this.http.post<DatabaseApiResponse>(`${this.URL}/collection/${name}`, data, { headers : headers });
    return this.http.post<DatabaseApiResponse>(`${this.URL}/collection/${name}`, data);
  }

  public delete(collection: string) : Observable<DatabaseApiResponse> {
    return this.http.delete<DatabaseApiResponse>(`${this.URL}/collection/${collection}`);
  }

  public apiCall(endPoint : string, parameters? : Array<string>) : Observable<DatabaseApiResponse> {

    if (!this.ENDPOINTS.includes(endPoint)) {
      throw new Error(`${endPoint} is not a valid endpoint`);
    } else {
      return this.http.get<DatabaseApiResponse>(`${this.URL}/${endPoint}`);
    }
  }

  public getCollection(collectionName : string) : Observable<Array<Object>> {
    return  this.http.get<Array<Object>>(`${this.URL}/collection/${collectionName}`);
  }

  public getAllCollections() : Observable<Array<string>> {
    return this.http.get<Array<string>>(`${this.URL}/collections`);
  }

  public compare(first, second) : Observable<Array<object>> {
    return this.http.get<Array<object>>(`${this.URL}/scoreCrossmatch/${first}/${second}`);
  }
}

export class DatabaseApiResponse {
  collection : Array<object>;
  status: string;
}
