import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionComponent } from './collection/collection.component';
import { DatabaseService, DatabaseApiResponse } from './database.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

describe('AppComponent', () => {

  const testApiData = [ { one : 1 }, { two : 2 }, { three: 4 } ];

  let databaseServiceStub : Partial<DatabaseService> = {
    apiCall: (ep:string) => {
      return Observable.create(obs => {
          let d : DatabaseApiResponse = {
            status : "",
            collection : testApiData
          };
          obs.next(d);
          obs.complete();
        }
      )
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ HttpClientModule ],
      declarations: [
        AppComponent, CollectionComponent, CollectionListComponent
      ],
      providers : [
        { provide: DatabaseService, useValue: databaseServiceStub },
        HttpClient
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
