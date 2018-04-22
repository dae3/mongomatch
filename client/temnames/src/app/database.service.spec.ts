import { TestBed, inject } from '@angular/core/testing';
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

  it('should error on invalid API calls', inject([DatabaseService], (service: DatabaseService) => {
    expect(() => {service.apiCall('NotARealEndpoint')}).toThrow(new Error('NotARealEndpoint is not a valid endpoint'))
  }));


  it('should return status', inject([DatabaseService], (service: DatabaseService) => {
    let x : DatabaseApiResponse = { status: 'something', collection : [] };

    service.apiCall('status').subscribe(data=>expect(data).toEqual(x));

    const req = httpTestingController.expectOne(`${BASEURL}/status`);
    expect(req.request.method).toBe('GET');

    req.flush(x);
  }));

  it('should return a collection', inject([DatabaseService], (db : DatabaseService) => {
    let resp : Array<Object> = [
        { firstRecordFirstThing: 'thing', firstRecordSecondThing: 'thingo' },
        { secondRecordFirstThing: 'thing', secondRecordSecondThing: 'thingo' },
        { thirdRecordFirstThing: 'thing', thirdRecordSecondThing: 'thingo' },
      ];

    db.getCollection('collectionName').subscribe((d) => expect(d).toBe(resp));
    const req = httpTestingController.expectOne(`${BASEURL}/collection/collectionName`);
    expect(req.request.method).toBe('GET');
    req.flush(resp);
  }));

  it('should return a list of all collections in the database', inject([DatabaseService], (db : DatabaseService) => {
    let resp = [ 'collectionTheFirst','collectionTheSecond' ];
    db.getAllCollections().subscribe(collections=>expect(collections).toBe(resp));
    const req = httpTestingController.expectOne(`${BASEURL}/collections`);
    expect(req.request.method).toBe('GET');
    req.flush(resp);
  })

});
