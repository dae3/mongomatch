import { TestBed, tick, fakeAsync, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { DatabaseService, DatabaseApiResponse } from './database.service';

describe('DatabaseService', () => {
  let httpClient : HttpClient;
  let httpTestingController : HttpTestingController;
  const BASEURL = 'http://localhost:8081';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatabaseService,HttpClient],
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', inject([DatabaseService], (service: DatabaseService) => {
    expect(service).toBeTruthy();
  }));

  it('should delete a collection', inject([DatabaseService], (db: DatabaseService) => {
    let res : DatabaseApiResponse = { status: 'ok', collection: [] };

    db.delete('2').subscribe(r=>expect(r.status).toBe('ok'));
    const req = httpTestingController.expectOne(`${BASEURL}/collection/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(res);

  }));

  it('should upload a file', inject([DatabaseService], (db: DatabaseService) => {
    let res : DatabaseApiResponse = { status: 'ok', collection: [] };

    let f = new File(['this is the file content'], 'andItHasAName.ext');
    db.upload('collectionname', 'somefield', f).subscribe(r => { expect(r.status).toBe('ok') });
    const req = httpTestingController.expectOne(`${BASEURL}/collection/collectionname`);
    expect(req.request.method).toBe('POST');
    req.flush(res);
  }));

  it('should error attempting to delete a non-existent collection', inject([DatabaseService], (db: DatabaseService) => {
    let res : DatabaseApiResponse = { status: 'bad', collection: [] };

    db.delete('aCollectionThatDoesntExist').subscribe(r=>expect(r.status).toBe('bad'));
    const req = httpTestingController.expectOne(`${BASEURL}/collection/aCollectionThatDoesntExist`);
    expect(req.request.method).toBe('DELETE');
    req.flush(res);

  }));



  it('should return a list of all collections in the database', inject([DatabaseService], (db : DatabaseService) => {
    let resp = [ 'collectionTheFirst','collectionTheSecond' ];
    db.getAllCollections().subscribe(collections=>expect(collections).toBe(resp));
    const req = httpTestingController.expectOne(`${BASEURL}/collections`);
    expect(req.request.method).toBe('GET');
    req.flush(resp);
  }));

	it('should compare two named collections', inject([DatabaseService], (db : DatabaseService) => {
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
    const req = httpTestingController.expectOne(`${BASEURL}/scoreCrossmatch/one/two`);
    expect(req.request.method).toBe('GET');
    req.flush(resp);

  }));

	it('should compare two numbered collections', inject([DatabaseService], (db : DatabaseService) => {
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
    const req = httpTestingController.expectOne(`${BASEURL}/scoreCrossmatch/2/1`);
    expect(req.request.method).toBe('GET');
    req.flush(resp);

  }));
});
