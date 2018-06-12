import { ComponentFixture, TestBed, fakeAsync, tick, async, flushMicrotasks } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionComponent } from './collection/collection.component';
import { DatabaseService, DatabaseApiResponse } from './database.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DataUploaderComponent } from './data-uploader/data-uploader.component';
import { ResultGridComponent } from './result-grid/result-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { marbles } from 'rxjs-marbles/jasmine';


describe('AppComponent', () => {

	let databaseServiceStub : Partial<DatabaseService> = {
		loading : new Subject<boolean>(),
		changed : new Subject<boolean>(),
		getAllCollections : () => of(['collection1','collection2','collection3']),
		getCollection : (c : string) => of([ { one : 1 }, { two : 2 }, { three: 4 } ])
	};
	let fixture : ComponentFixture<AppComponent>;
	let element : HTMLElement;
	let component : AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ HttpClientModule, FormsModule, ReactiveFormsModule ],
      declarations: [
        AppComponent,
        CollectionComponent,
        CollectionListComponent,
        DataUploaderComponent,
        ResultGridComponent
      ],
      providers : [
        { provide: DatabaseService, useValue: databaseServiceStub },
        HttpClient
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		element = fixture.nativeElement;
  }));

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

	it('should display the spinner', fakeAsync(marbles(m => {
		const spinnerDiv = () => element.querySelector('div.spinner');
		const db = fixture.debugElement.injector.get(DatabaseService);
		db.loading = m.cold('ftf',{t:true, f:false});

		tick();
		fixture.detectChanges();
		expect(spinnerDiv()).toBe(null, 'but not initially');
		tick();
		fixture.detectChanges();
		expect(spinnerDiv()).not.toBe(null, 'while loading');
		fixture.detectChanges();
		expect(spinnerDiv()).toBe(null, 'but not after loading');

	})));
});
