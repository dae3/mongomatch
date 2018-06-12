import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHandler,  HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { tap, distinctUntilChanged, delay, throttle, finalize, startWith } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Injectable()
export class DatabaseService {
  readonly URL = "http://localhost:8081";
  readonly ENDPOINTS = [
    'status','crossmatch','scoreCrossmatch','collection','data'
  ]
	private _loading : Subject<boolean> = new Subject<boolean>();
	public loading : Subject<boolean> = new Subject<boolean>();
	public changed : Subject<boolean> = new Subject<boolean>();

	constructor(private http : HttpClient) {
		this._loading.pipe(distinctUntilChanged()).subscribe(this.loading);
	}

  public data() {
    let v = { element : { subelement : 'dummy'}};
    return v;
  }

	subjectify(sourceStream : Observable<any>) : Observable<any> {
		// use side-effects to avoid end on the sourceStream ending this.loading
		this.loading.next(true);
		return sourceStream.pipe(
			finalize(() => this.loading.next(false))
		);
	}

  public upload(name: string, sheetname: string, namefield: string, file: File) : Observable<DatabaseApiResponse> {
    const data = new FormData();
    data.set('namefield', namefield);
    data.set('sheet', sheetname);
    data.set('file', file);
		return this.subjectify(this.http.post<DatabaseApiResponse>(`${this.URL}/collection/${name}`, data));
  }

  public delete(collection: string) : Observable<DatabaseApiResponse> {
		return this.subjectify(this.http.delete<DatabaseApiResponse>(`${this.URL}/collection/${collection}`));
  }

  public getCollection(collectionName : string) : Observable<Array<Object>> {
    return this.subjectify(this.http.get<Array<Object>>(`${this.URL}/collection/${collectionName}`));
  }

  public getAllCollections() : Observable<Array<string>> {
    return this.subjectify(this.http.get<Array<string>>(`${this.URL}/collections`));
  }

  public compare(first: string, second: string) : Observable<Array<object>> {
		return this.subjectify(this.http.get<Array<object>>(
			`${this.URL}/scoreCrossmatch/${this.collectionName(first)}/${this.collectionName(second)}`
		));
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
