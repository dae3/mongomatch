import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class DatabaseService {
  readonly URL = "http://localhost:8081";
  readonly ENDPOINTS = [
    'status','crossmatch','scoreCrossmatch','collection','data'
  ]

  constructor(private http : HttpClient) { }

  public data() {
    let v = { element : { subelement : 'dummy'}};
    return v;
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
}

export class DatabaseApiResponse {
  collection : Array<object>;
  status: string;
}
