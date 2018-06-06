import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionListComponent } from './collection-list.component';
import { CollectionComponent } from '../collection/collection.component';
import { ResultGridComponent } from '../result-grid/result-grid.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Subject } from 'rxjs';
import { of } from 'rxjs/observable/of';

describe('CollectionListComponent', () => {
  let component: CollectionListComponent;
  let fixture: ComponentFixture<CollectionListComponent>;
  let elt : HTMLElement;
  const dummyDbCollections = ['collection1','collection2','collection3'];
  const dummyCompareResult = [
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

  let mockDbService : Partial<DatabaseService> = {
		getAllCollections : () => of(dummyDbCollections),
    getCollection : () => of([{},{},{}]),
    compare: (first: string, second: string) => of(dummyCompareResult),
		loading : new Subject(),
		changed : new Subject()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
         CollectionListComponent,
         CollectionComponent,
          ResultGridComponent
        ],
      providers: [
				{ provide: DatabaseService,  useValue: mockDbService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    elt = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

	it('should notice database changes and reload', () => {
		const dbs = fixture.debugElement.injector.get(DatabaseService);
		const dbspy = spyOn(dbs, 'getAllCollections').and.callThrough();
		fixture.detectChanges();
		const callcount = dbspy.calls.count();

		dbs.changed.next(true);

		// 1 call from this component, 2 (1 each) from the 2 child Collection components
		expect(dbspy.calls.count()).toEqual(callcount+1+2);
	});

  it('should load all collections from the database', () => {
    expect(elt.querySelectorAll('select#collection1 option').length).toBe(dummyDbCollections.length+1);
    expect(elt.querySelectorAll('select#collection2 option').length).toBe(dummyDbCollections.length+1);

    var actual = [];
    var expected = ['Choose a collection'];
    Array.prototype.push.apply(expected, dummyDbCollections);
    elt.querySelectorAll('select#collection1 option').forEach( e=>actual.push((e as HTMLOptionElement).label) );
    expect(actual).toEqual(expected);

    var actual = [];
    var expected = ['Choose a collection'];
    Array.prototype.push.apply(expected, dummyDbCollections);
    elt.querySelectorAll('select#collection2 option').forEach( e=>actual.push((e as HTMLOptionElement).label) );
    expect(actual).toEqual(expected);
  })

  it('should have a compare button enabled once collections are chosen', () => {
    const button = elt.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBeTruthy();

    (elt.querySelector('select#collection1') as HTMLSelectElement).value = dummyDbCollections[0];
    elt.querySelector('select#collection1').dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(button.disabled).toBeTruthy();

    (elt.querySelector('select#collection2') as HTMLSelectElement).value = dummyDbCollections[1];
    elt.querySelector('select#collection2').dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(button.disabled).not.toBeTruthy();
  })

  it('compares 2 selected collections', () => {
    const compareSpy = spyOn(fixture.debugElement.injector.get(DatabaseService), 'compare').and.callThrough();

    (elt.querySelector('select#collection1') as HTMLSelectElement).value = dummyDbCollections[0];
    elt.querySelector('select#collection1').dispatchEvent(new Event('change'));

    (elt.querySelector('select#collection2') as HTMLSelectElement).value = dummyDbCollections[1];
    elt.querySelector('select#collection2').dispatchEvent(new Event('change'));
    elt.querySelector('button').dispatchEvent(new Event('click'));
    expect(compareSpy).toHaveBeenCalledWith(dummyDbCollections[0], dummyDbCollections[1]);
  });

  it('displays comparison results', () => {
    (elt.querySelector('select#collection1') as HTMLSelectElement).value = dummyDbCollections[0];
    elt.querySelector('select#collection1').dispatchEvent(new Event('change'));
    (elt.querySelector('select#collection2') as HTMLSelectElement).value = dummyDbCollections[1];
    elt.querySelector('select#collection2').dispatchEvent(new Event('change'));
    elt.querySelector('button').dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(elt.querySelectorAll('div.result table tr').length).toBe(dummyCompareResult.length);
  })
});
