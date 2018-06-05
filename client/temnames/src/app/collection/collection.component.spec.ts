import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatabaseService } from '../database.service';
import { CollectionComponent } from './collection.component';
import { Subject } from 'rxjs';
import { of } from 'rxjs/observable/of';

describe('CollectionComponent', () => {
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;
  const testApiData = [ { oneOne : 1, oneTwo : 2 }, { twoOne : 21, twoTwo: 22 }, { three: 4 } ];
  let elt : HTMLElement;

  let databaseServiceStub : Partial<DatabaseService> = {
    getCollection : (name : string) => of(testApiData),
		loading : new Subject(),
		changed : new Subject(),
		getAllCollections : () => of(['collection1','collection2','collection2'])
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionComponent ],
      providers : [ { provide: DatabaseService, useValue: databaseServiceStub } ]
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

	it('should load from the database service', () => {
		const s = spyOn(fixture.debugElement.injector.get(DatabaseService), 'getCollection')
			.and.returnValue(of([{ a1: 'a1', b1: 'b1' },{ a2: 'a2', b2: 'b2' }]));
		component.name = 'collection1';
		fixture.detectChanges();
		expect(s).toHaveBeenCalledWith('collection1');
	});

	it('should show the collection size', () => {
		component.name = 'collection2';
		fixture.detectChanges();
		const theDiv = elt.querySelector('h1');
		expect(theDiv.firstChild.textContent).toBe(`${testApiData.length} documents`);
	});

	it('should show a sample document', () => {
		component.name = 'collection1';
		fixture.detectChanges();
		const liElements = elt.querySelectorAll('div#sampleDoc ul li');
		const testKeys = testApiData.map(e=>Object.keys(e));
		expect(liElements).toBeTruthy();
		expect(liElements.length).toBe(Object.keys(testApiData[0]).length);
		expect(liElements[0].firstChild.textContent).toBe(testKeys[0][0]);
	});

	it('should blank and not attempt to load if the name is undefined', () => {
		const s = spyOn(fixture.debugElement.injector.get(DatabaseService), 'getCollection')
			.and.callThrough();

		component.name = 'collection1';
		fixture.detectChanges();
		const callCount = s.calls.count();

		component.name = undefined;
		fixture.detectChanges();
		expect(s.calls.count()).toEqual(callCount); // didn't call again

		expect(elt.querySelector('h1')).toBe(null);
		expect(elt.querySelectorAll('ul li').length).toBe(0);

	});

	it('should reload if the database changes', () => {
		let dbs = fixture.debugElement.injector.get(DatabaseService);
		spyOn(dbs, 'getCollection').and.callThrough();
		spyOn(dbs, 'getAllCollections').and.callThrough();
		component.name = 'collection1';
		const callCount = dbs.getCollection.calls.count();
		dbs.changed.next();
		expect(dbs.getCollection.calls.count()).toEqual(callCount+1);
	});

	it('should blank if the selected collection vanishes', () => {
		let dbs = fixture.debugElement.injector.get(DatabaseService);
		const gcSpy = spyOn(dbs, 'getAllCollections').and.returnValues(
			of(['one','two','three']), of(['one','three'])
		);

		component.name = 'two';
		fixture.detectChanges();
		dbs.changed.next();
		fixture.detectChanges();

		expect(elt.querySelector('h1')).toBe(null);
		expect(elt.querySelectorAll('ul li').length).toBe(0);

	});
});
