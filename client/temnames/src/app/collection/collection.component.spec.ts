import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatabaseService } from '../database.service';
import { CollectionComponent } from './collection.component';
import { of } from 'rxjs/observable/of';

xdescribe('CollectionComponent', () => {
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;
  const testApiData = [ { oneOne : 1, oneTwo : 2 }, { twoOne : 21, twoTwo: 22 }, { three: 4 } ];
  let elt : HTMLElement;

  let databaseServiceStub : Partial<DatabaseService> = {
    getCollection : (name : string) => of(testApiData)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionComponent ],
      providers : [
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
   component.name = 'thename';
   fixture.detectChanges();
   const nameElt = elt.querySelector('h1');
   expect(nameElt.firstChild.textContent).toBe('thename');
 });

 it('should show the collection size', () => {
   component.name = 'something';
   fixture.detectChanges();
   const theDiv = elt.querySelector('div.collectionCount');
   expect(theDiv.firstChild.textContent).toBe(`this collection has ${testApiData.length} documents`);
 })

	it('should load from the database service', () => {
		const s = spyOn(fixture.debugElement.injector.get(DatabaseService), 'getCollection').and.returnValue(of([{ a1: 'a1', b1: 'b1' },{ a2: 'a2', b2: 'b2' }]));
		component.name = 'trigger';
		fixture.detectChanges();
		expect(s).toHaveBeenCalled();
	});

 it('should not attempt to load if the name is undefined', () => {
   const s = spyOn(fixture.debugElement.injector.get(DatabaseService), 'getCollection').and.returnValue(of('foo'));
   component.name = undefined;
   fixture.detectChanges();
   expect(s).not.toHaveBeenCalled();
 })

 xit('should display a progress \'spinner\' while loading', fakeAsync(() => {
   const getSpinner = () => elt.querySelector('div.spinner');
   expect(getSpinner()).toBe(null);
   component.name = 'anything';
   fixture.detectChanges();
   expect(getSpinner()).not.toBe(null);

 }))

 it('should show a sample document', () => {
   component.name = 'anything';
   fixture.detectChanges();
   const liElements = elt.querySelectorAll('div#sampleDoc ul li');
   const testKeys = testApiData.map(e=>Object.keys(e));
   expect(liElements).toBeTruthy();
   expect(liElements.length).toBe(Object.keys(testApiData[0]).length);
   expect(liElements[0].firstChild.textContent).toBe(testKeys[0][0]);
  }
   // entry for each  key in the document
   // expect(theUl.querySelectorAll('li').length).toBe(Object.keys(testApiData[0]).length)
 );

});
