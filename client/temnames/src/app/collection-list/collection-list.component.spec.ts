import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionListComponent } from './collection-list.component';
import { CollectionComponent } from '../collection/collection.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseService } from '../database.service';
import { of } from 'rxjs/observable/of';

describe('CollectionListComponent', () => {
  let component: CollectionListComponent;
  let fixture: ComponentFixture<CollectionListComponent>;
  let elt : HTMLElement;
  const dummyDbCollections = ['collectionTheFirst','collectionTheSecond','collectionTheThird'];

  // stub CollectionComponent to avoid all its dependencies
  @Component({selector: 'app-collection', template: ''})
  class CollectionComponent {
    private _selected;
    @Input() public set collectionName(v: string) {};
    @Input() public set selected(v: boolean) { this._selected = v }
    @Output() public selectionChanged : EventEmitter<boolean> = new EventEmitter();
    @Input() public set selected(v: boolean)
  }

  let mockDbService : Partial<DatabaseService> = {
    getAllCollections : () => of(dummyDbCollections)
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionListComponent, CollectionComponent ],
      providers: [
        { provide: DatabaseService,  useValue: mockDbService }
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

  it('should add a collection', () => {
    const baseElt : HTMLElement = fixture.nativeElement;
    var li = baseElt.querySelectorAll('table tr');
    const origCount = li == null ? 0 : li.length;
    component.addCollection('anything');
    fixture.detectChanges();
    li = baseElt.querySelectorAll('tr.collection');
    expect(li.length).toBe(origCount+1);
  })

  it('should load all collections from the database', () => {
    expect(elt.querySelectorAll('tr.collection').length).toBe(dummyDbCollections.length);
  })

  it('allows no more than 2 selected collections', () => {
    
  })
});
