import { inject, tick, flush, fakeAsync, async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpRequest, HttpHandler, HttpInterceptor, HttpHeaders, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { SpinnerService, ObservableInjector } from './spinner.service';


describe('SpinnerService', () => {
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
    const req = httpTestingController.expectOne('/doesntMatter');
    req.flush(res);
    tick();
    expect(testObserver.next).toHaveBeenCalledWith(false);
  })));

	it('should have an Observable database changed status', inject([SpinnerService], (ss: SpinnerService) => {

		const res = {};
		const testObserver = { next : (b: boolean) => b };
		const s = spyOn(testObserver, 'next');
		ss.hasChanged.subscribe(testObserver);

		httpClient.delete<any>('/whatever').subscribe(()=>{});
    httpTestingController.expectOne('/whatever').flush(res);
		expect(s.calls.count()).toBe(1);

		httpClient.post('/something', {}).subscribe(()=>{});
		httpTestingController.expectOne('/something').flush(res);
		expect(s.calls.count()).toBe(2);

		httpClient.get('/foo').subscribe(()=>{});
    httpTestingController.expectOne('/foo').flush(res);
		expect(s.calls.count()).toBe(2);

	}));
	
});
