import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandler, HttpInterceptor, HttpHeaders, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Injectable()
export class DatabaseService {
  readonly URL = "http://localhost:8081";
  readonly ENDPOINTS = [
    'status','crossmatch','scoreCrossmatch','collection','data'
  ]
  public loading : Observable<boolean>;
	private rawLoading : Subject<any>;

	public changed : Observable<boolean>;

  constructor(private http : HttpClient) {
		this.rawLoading = new Subject<any>();
		this.loading = this.rawLoading.map(()=>false).startWith(true).share();
		this.changed = new Subject<boolean>();
  }

  public data() {
    let v = { element : { subelement : 'dummy'}};
    return v;
  }

  public upload(name: string, sheetname: string, namefield: string, file: File) : Observable<DatabaseApiResponse> {
    const data = new FormData();
    data.set('namefield', namefield);
    data.set('sheet', sheetname);
    data.set('file', file);
		const res = this.http.post<DatabaseApiResponse>(`${this.URL}/collection/${name}`, data).share();
		res.subscribe(this.rawLoading);
		res.map(()=>true).subscribe(this.changed);
    return res;
  }

  public delete(collection: string) : Observable<DatabaseApiResponse> {
		const res = this.http.delete<DatabaseApiResponse>(`${this.URL}/collection/${collection}`).share();
		res.subscribe(this.rawLoading);
		res.filter((r)=>r.status!='bad').map(()=>true).subscribe(this.changed);
		return res;
  }

  public getCollection(collectionName : string) : Observable<Array<Object>> {
    return  this.http.get<Array<Object>>(`${this.URL}/collection/${collectionName}`);
  }

  public getAllCollections() : Observable<Array<string>> {
    const res = this.http.get<Array<string>>(`${this.URL}/collections`).share();
		res.subscribe(this.rawLoading);
		return res;
  }

  public compare(first: string, second: string) : Observable<Array<object>> {
		const res = this.http.get<Array<object>>(
			`${this.URL}/scoreCrossmatch/${this.collectionName(first)}/${this.collectionName(second)}`
		).share();
		res.subscribe(this.rawLoading);
		return res;
  }

	collectionName(name: string) : string {
		let match = name.match(/^data([1-9]{1})/);
		if (match) { return match[1] }
		else { return name }
	}
}

export class DatabaseApiResponse {
  collection : Array<object>;
  status: string;
}
