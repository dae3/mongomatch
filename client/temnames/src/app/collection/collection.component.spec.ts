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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an ul with an li for each collection document', () => {
    component.collectionName = 'doesn\'t matter';
    fixture.detectChanges();
    const baseElt : HTMLElement = fixture.nativeElement;
    const li = baseElt.querySelectorAll('ul li');
    expect(li.length).toBe(testApiData.length);
  });


});
