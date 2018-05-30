import { Injectable, ApplicationRef } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { publish } from 'rxjs/operators';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map'; // flatMap
import 'rxjs/add/operator/share';

@Injectable()
export class SpinnerService {
	public hasChanged : Observable<boolean>;
	public isLoading : Subject<boolean>;
	private rawHasChanged : Subject<HttpRequest<any>>;

	constructor(app : ApplicationRef) {
		this.isLoading = new Subject();
		this.rawHasChanged = new Subject<HttpRequest<any>>();
		this.hasChanged = this.rawHasChanged
		.map(req=>['POST','DELETE'].includes(req.method)).filter(a=>a);
	}

	public newRequest(req : HttpRequest<any>, next : HttpHandler) : Observable<any> {
		// share otherwise requests to server are duplicated
		const res = next.handle(req).pipe(publish());

		// isLoading true if event is anything but Response (type==4)
		// debounce() to stop changes within Angular change detection cycle
		res.pluck('type').map(type=>type!=4).startWith(false).distinctUntilChanged()
		.debounce((_)=>Promise.resolve(0))
		.subscribe(this.isLoading);

		// hasChanged true if method in ['POST','DELETE']
		this.rawHasChanged.next(req);

		res.connect();
		return res;
	}
}

@Injectable()
export class ObservableInjector implements HttpInterceptor {

	constructor(private spinner : SpinnerService) {}

	public intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
		return this.spinner.newRequest(req, next);
	}

}
