import { inject, tick, flush, fakeAsync, async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpRequest, HttpHandler, HttpInterceptor, HttpHeaders, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { SpinnerService, ObservableInjector } from './spinner.service';


xdescribe('SpinnerService', () => {
  var httpClient : HttpClient;
  var httpTestingController : HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SpinnerService,
        { provide: HTTP_INTERCEPTORS, useClass: ObservableInjector, multi: true },
      ],
      imports : [ HttpClientTestingModule ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([SpinnerService], (service: SpinnerService) => {
    expect(service).toBeTruthy();
  }));

  it('should have an Observable loading status', fakeAsync(inject([SpinnerService], (ss: SpinnerService) => {
    const res = {};
    const testObserver = { next: (b: boolean) =>  b }
    spyOn(testObserver, 'next');

    ss.isLoading.subscribe(testObserver);
    httpClient.get<any>('/doesntMatter').subscribe(()=>{});
    // ensure nothing emitted until waiting a turn
    expect(testObserver.next).not.toHaveBeenCalled();
    tick();
    expect(testObserver.next).toHaveBeenCalledWith(true);
    const req = httpTestingController.expectOne('/doesntMatter');
    req.flush(res);
    tick();
    expect(testObserver.next).toHaveBeenCalledWith(false);
  })));
});
