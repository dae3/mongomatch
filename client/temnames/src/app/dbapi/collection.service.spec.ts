import { TestBed, inject } from '@angular/core/testing';
import { CollectionService } from './collection.service';
import { DatabaseService } from './database.service';

describe('CollectionService', () => {
  beforeEach(() => {
    const dbSpy = jasmine.createSpyObj('DatabaseService', ['something']);

    TestBed.configureTestingModule({
      providers: [
        CollectionService,
        { provide: DatabaseService, useValue: dbSpy }
      ]
    });


  });

  it('should be created', inject([CollectionService], (service: CollectionService) => {
    expect(service).toBeTruthy(); // something
  }));

});
