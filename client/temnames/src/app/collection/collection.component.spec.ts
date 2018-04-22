import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatabaseService, DatabaseApiResponse } from '../database.service';
import { CollectionComponent } from './collection.component';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('CollectionComponent', () => {
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;
  const testApiData = [ { one : 1 }, { two : 2 }, { three: 4 } ];
  let elt : HTMLElement;

  let databaseServiceStub : Partial<DatabaseService> = {
    getCollection : (name : string) => of(testApiData)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      declarations: [ CollectionComponent ],
      providers : [
        HttpClient,
        { provide: DatabaseService, useValue: databaseServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    elt = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 it('should show the collection name', () => {
   component.collectionName = 'thename';
   fixture.detectChanges();
   const nameElt = elt.querySelector('h1');
   expect(nameElt.firstChild.textContent).toBe('thename');
 });

 it('should show the collection size', () => {
   component.collectionName = 'something';
   fixture.detectChanges();
   const theDiv = elt.querySelector('div#count');
   expect(theDiv.firstChild.textContent).toBe(`this collection has ${testApiData.length} documents`);
 })


});
