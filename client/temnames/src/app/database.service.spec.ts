import { TestBed, tick, async, fakeAsync, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { DatabaseService, DatabaseApiResponse } from './database.service';
import { Subject } from 'rxjs/Subject';

describe('DatabaseService', () => {
  let httpClient : HttpClient;
  let httpTestingController : HttpTestingController;
	let db : DatabaseService;
  const BASEURL = 'http://localhost:8081';
	const loadingObserver = {
		next : (x: boolean) => {},
		complete : () => {}
	};
	const changeObserver = {
		next : (x: boolean) => {},
		complete : () => {}
	};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatabaseService,HttpClient],
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
		db = new DatabaseService(httpClient);
		spyOn(loadingObserver, 'next').and.stub();
		spyOn(loadingObserver, 'complete').and.stub();
		db.loading.subscribe(loadingObserver);
		spyOn(changeObserver, 'next').and.stub();
		spyOn(changeObserver, 'complete').and.stub();
		db.changed.subscribe(changeObserver);
  });

	afterEach(() => { httpTestingController.verify() });

  it('should be created', () => {
    expect(db).toBeTruthy();
  });

	it('should load a collection', fakeAsync(() => {
		db.getCollection('something').subscribe(()=>{});
		const req = httpTestingController.expectOne(`${BASEURL}/collection/something`);
		expect(req.request.method).toBe('GET');
		req.flush({});
		tick();
		expect(loadingObserver.next.calls.allArgs()).toEqual([[true], [false]]);
		expect(changeObserver.complete).not.toHaveBeenCalled();
	}));

  it('should delete a collection', fakeAsync(() => {
    let res : DatabaseApiResponse = { status: 'ok', collection: [] };

    db.delete('2').subscribe(r=>expect(r.status).toBe('ok'));
		expect(loadingObserver.next).toHaveBeenCalledWith(true);
		expect(changeObserver.next).not.toHaveBeenCalled();
    const req = httpTestingController.expectOne(`${BASEURL}/collection/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(res);
		tick();
		expect(loadingObserver.next).toHaveBeenCalledWith(false);
		expect(loadingObserver.next).toHaveBeenCalledTimes(2);
		//expect(changeObserver.next).toHaveBeenCalledWith(true);
  }));

  it('should upload a file', fakeAsync(() => {
    let res : DatabaseApiResponse = { status: 'ok', collection: [] };

    let f = new File(['this is the file content'], 'andItHasAName.ext');
    db.upload('collectionname', 'sheetname', 'namefield', f).subscribe(r => { expect(r.status).toBe('ok') });
		expect(loadingObserver.next).toHaveBeenCalledWith(true);
		expect(changeObserver.next).not.toHaveBeenCalled();
    const req = httpTestingController.expectOne(`${BASEURL}/collection/collectionname`);
    expect(req.request.method).toBe('POST');
		expect(req.request.body.get('sheet')).toBe('sheetname');
		expect(req.request.body.get('namefield')).toBe('namefield');
    req.flush(res);
		tick();
		expect(loadingObserver.next).toHaveBeenCalledWith(false);
		expect(loadingObserver.next).toHaveBeenCalledTimes(2);
		//expect(changeObserver.next).toHaveBeenCalledWith(true);
  }));

  it('should error attempting to delete a non-existent collection', fakeAsync(() => {
    let res : DatabaseApiResponse = { status: 'bad', collection: [] };

    db.delete('aCollectionThatDoesntExist').subscribe(r=>expect(r.status).toBe('bad'));
		expect(loadingObserver.next).toHaveBeenCalledWith(true);
		expect(changeObserver.next).not.toHaveBeenCalled();
    const req = httpTestingController.expectOne(`${BASEURL}/collection/aCollectionThatDoesntExist`);
    expect(req.request.method).toBe('DELETE');
    req.flush(res);
		tick();
		expect(loadingObserver.next).toHaveBeenCalledWith(false);
		expect(loadingObserver.next).toHaveBeenCalledTimes(2);
		expect(changeObserver.next).not.toHaveBeenCalled();
  }));

  it('should upload a file', fakeAsync(() => {
    let res : DatabaseApiResponse = { status: 'ok', collection: [] };

    let f = new File(['this is the file content'], 'andItHasAName.ext');
    db.upload('collectionname', 'sheetname', 'namefield', f).subscribe(r => { expect(r.status).toBe('ok') });
		expect(loadingObserver.next).toHaveBeenCalledWith(true);
		expect(changeObserver.next).not.toHaveBeenCalled();
    const req = httpTestingController.expectOne(`${BASEURL}/collection/collectionname`);
    expect(req.request.method).toBe('POST');
		expect(req.request.body.get('sheet')).toBe('sheetname');
		expect(req.request.body.get('namefield')).toBe('namefield');
    req.flush(res);
		tick();
		expect(loadingObserver.next).toHaveBeenCalledWith(false);
		expect(loadingObserver.next).toHaveBeenCalledTimes(2);
		//expect(changeObserver.next).toHaveBeenCalled();
  }));

  it('should return a list of all collections in the database', fakeAsync(() => {
    let resp = [ 'collectionTheFirst','collectionTheSecond' ];
    db.getAllCollections().subscribe(collections=>expect(collections).toBe(resp));
		expect(loadingObserver.next).toHaveBeenCalledWith(true);
    const req = httpTestingController.expectOne(`${BASEURL}/collections`);
    expect(req.request.method).toBe('GET');
    req.flush(resp);
		tick();
		expect(loadingObserver.next).toHaveBeenCalledWith(false);
		expect(loadingObserver.next).toHaveBeenCalledTimes(2);
		expect(changeObserver.next).not.toHaveBeenCalled();
  }));

	it('should compare two named collections', fakeAsync(() => {
    let resp = [
      {
         _id: 1,
         somefield: 'aaa',
         name: 'John Doe',
         names: ['john','doe'],
         matchedNames: [
           { name: 'John Smith', score: 1 },
           { name: 'Jane Doe', score: 2 }
         ]
      },
      {
         _id: 2,
         somefield: 'bbb',
         name: 'Jane Smith',
         names: ['jane','smith'],
         matchedNames: [
           { name: 'John Smith', score: 1 },
           { name: 'Jane Doe', score: 2 }
         ]
      }
    ];
    db.compare('one','two').subscribe(result=>expect(result).toBe(resp));
		expect(loadingObserver.next).toHaveBeenCalledWith(true);
    const req = httpTestingController.expectOne(`${BASEURL}/scoreCrossmatch/one/two`);
    expect(req.request.method).toBe('GET');
    req.flush(resp);
		tick();
		expect(loadingObserver.next).toHaveBeenCalledWith(false);
		expect(loadingObserver.next).toHaveBeenCalledTimes(2);
		//expect(changeObserver.next).not.toHaveBeenCalled();

  }));

	it('should compare two numbered collections', fakeAsync(() => {
    let resp = [
      {
         _id: 1,
         somefield: 'aaa',
         name: 'John Doe',
         names: ['john','doe'],
         matchedNames: [
           { name: 'John Smith', score: 1 },
           { name: 'Jane Doe', score: 2 }
         ]
      },
      {
         _id: 2,
         somefield: 'bbb',
         name: 'Jane Smith',
         names: ['jane','smith'],
         matchedNames: [
           { name: 'John Smith', score: 1 },
           { name: 'Jane Doe', score: 2 }
         ]
      }
    ];
    db.compare('data2','data1').subscribe(result=>expect(result).toBe(resp));
		expect(loadingObserver.next).toHaveBeenCalledWith(true);
    const req = httpTestingController.expectOne(`${BASEURL}/scoreCrossmatch/2/1`);
    expect(req.request.method).toBe('GET');
    req.flush(resp);
		tick();
		expect(loadingObserver.next).toHaveBeenCalledWith(false);
		expect(loadingObserver.next).toHaveBeenCalledTimes(2);
		//expect(changeObserver.next).not.toHaveBeenCalled();

  }));

	xit('should not change loading status within a turn', fakeAsync(() => {
		db.getCollection('something').subscribe(()=>{ });
		const req = httpTestingController.expectOne(`${BASEURL}/collection/something`);
		expect(loadingObserver.next.calls.count()).toBe(1);
		expect(loadingObserver.next).toHaveBeenCalledWith(true);
		req.flush({});
		tick();
		expect(loadingObserver.next.calls.allArgs()).toEqual([[true],[false]]);
	}));
});
