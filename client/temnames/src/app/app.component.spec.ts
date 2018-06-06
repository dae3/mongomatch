import { ComponentFixture, TestBed, fakeAsync, tick, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionComponent } from './collection/collection.component';
import { DatabaseService, DatabaseApiResponse } from './database.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { DataUploaderComponent } from './data-uploader/data-uploader.component';
import { ResultGridComponent } from './result-grid/result-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';

describe('AppComponent', () => {

  const testApiData = [ { one : 1 }, { two : 2 }, { three: 4 } ];

	let databaseServiceStub : Partial<DatabaseService> = {
		loading : new Subject<boolean>(),
		changed : new Subject<boolean>()
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

  xit('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

	it('should display the spinner', () => {
		const spinnerDiv = () => element.querySelector('div.spinner');
		const db = fixture.debugElement.injector.get(DatabaseService);

		expect(spinnerDiv()).toBe(null);
		db.loading.next(true);
		fixture.detectChanges();
		expect(spinnerDiv()).not.toBe(null);
		db.loading.next(false);
		fixture.detectChanges();
		expect(spinnerDiv()).toBe(null);

	});
});
