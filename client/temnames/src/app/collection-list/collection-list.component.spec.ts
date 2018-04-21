import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionListComponent } from './collection-list.component';
import { Component, Input } from '@angular/core';

describe('CollectionListComponent', () => {
  let component: CollectionListComponent;
  let fixture: ComponentFixture<CollectionListComponent>;

  // stub CollectionComponent to avoid all its dependencies
  @Component({selector: 'app-collection', template: ''})
  class CollectionComponent {
    @Input() public set collectionName(v: string) {};
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionListComponent, CollectionComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a collection', () => {
    const baseElt : HTMLElement = fixture.nativeElement;
    const li = baseElt.querySelectorAll('table tr');
    const origCount = li == null ? 0 : li.length;
    component.addCollection('anything');
    fixture.detectChanges();
    const li = baseElt.querySelectorAll('table tr');
    expect(li.length).toBe(origCount+1);
  })
});
