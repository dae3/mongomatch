import { Injectable, ApplicationRef } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { tap, finalize } from 'rxjs/operators';
import 'rxjs/add/operator/debounce';

@Injectable()
export class SpinnerService {
  public isLoading: Observable<boolean>;
  private _rawLoading : Subject<boolean>

  constructor(app : ApplicationRef) {
    this._rawLoading = new Subject();
    this.isLoading = this._rawLoading.debounce(()=>Promise.resolve(0));
   }

   public newRequest(req : Observable<any>) :Observable<any> {
     return req.pipe(
       tap(()=>this._rawLoading.next(true)),
       finalize(()=>this._rawLoading.next(false))
     );
   }
}

@Injectable()
export class ObservableInjector implements HttpInterceptor {

  constructor(private spinner : SpinnerService) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
    return this.spinner.newRequest(next.handle(req));
  }

}
