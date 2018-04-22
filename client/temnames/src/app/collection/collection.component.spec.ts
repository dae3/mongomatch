import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatabaseService } from '../database.service';
import { CollectionComponent } from './collection.component';
import { of } from 'rxjs/observable/of';

describe('CollectionComponent', () => {
  let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;
  const testApiData = [ { oneOne : 1, oneTwo : 2 }, { twoOne : 21, twoTwo: 22 }, { three: 4 } ];
  let elt : HTMLElement;
  let debugElement : debugElement;

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
    debugElement = fixture.debugElement;
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

 it('should show a sample document', () => {
   component.collectionName = 'anything';
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

 it('can be selected', () => {
   const cb = elt.querySelector('div#selectedFlag input');
   expect(component.selected).toBe(false);
   expect(cb.checked).not.toBeTruthy();
   component.selected = true;
   fixture.detectChanges();
   expect(cb.checked).toBeTruthy();

   // cb.checked = false;
   // fixture.detectChanges();
   // expect(component.selected).not.toBeTruthy();
 })

 // spy on the emitter function
 it('generates an event on selection change', fakeAsync(() => {
   spyOn(component.selectionChanged, 'emit');
   component.selected = false;
   expect(component.selectionChanged.emit).toHaveBeenCalledWith(false);
 })
});
