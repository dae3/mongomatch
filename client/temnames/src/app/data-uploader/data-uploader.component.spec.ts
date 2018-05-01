import { tick, flush, fakeAsync, async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatabaseService } from '../database.service';
import { of } from 'rxjs/observable/of';
import { DataUploaderComponent } from './data-uploader.component';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

xdescribe('DataUploaderComponent', () => {
  let component: DataUploaderComponent;
  let fixture: ComponentFixture<DataUploaderComponent>;
  let element : HTMLElement;
  var dummyDbCollections : Array<string>;

  let mockDbService : Partial<DatabaseService> = {
    getAllCollections : () => of(dummyDbCollections),
    delete: (collection: string) => {
      dummyDbCollections = dummyDbCollections.filter(a=>a!=collection);
      return of({status:'ok', collection:[]});
    },
    upload: (data: object) => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataUploaderComponent ],
      imports : [ FormsModule, ReactiveFormsModule ],
      providers: [
        { provide: DatabaseService,  useValue: mockDbService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    dummyDbCollections = ['collection1','collection2','collection3'];
    fixture = TestBed.createComponent(DataUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a list of collections', () => {
      const cols = () => element.querySelectorAll('div.collectionList span');

      expect(cols().length).toBe(dummyDbCollections.length);
  });

  it('should enable the upload button when the form is complete', () => {
    const submit = () => (element.querySelector('form button[type=\'submit\']') as HTMLButtonElement);

    expect(submit().disabled).toBeTruthy();

    element.querySelector('input[formControlName=\'name\']').value = 'collectionname';
    element.querySelector('input[formControlName=\'name\']').dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(submit().disabled).toBeTruthy();

    element.querySelector('input[formControlName=\'fileValidator\']').value = 'something';
    element.querySelector('input[formControlName=\'fileValidator\']').dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(submit().disabled).toBeTruthy();

    element.querySelector('input[formControlName=\'namefield\']').value = 'something';
    element.querySelector('input[formControlName=\'namefield\']').dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(submit().disabled).not.toBeTruthy();
  });

  it('should upload a collection', () => {
    // can't manipulate the file input control programmaticaly so just poke
    // a dummy valid into the  hidden validator field and expect an undefined
    // file on the  database call
    const dspy = spyOn(fixture.debugElement.injector.get(DatabaseService), 'upload').and.returnValue(of('foo'));
    element.querySelector('input[formControlName=\'name\']').value = 'collectionname';
    element.querySelector('input[formControlName=\'name\']').dispatchEvent(new Event('input'));
    element.querySelector('input[formControlName=\'fileValidator\']').value = 'filename';
    element.querySelector('input[formControlName=\'fileValidator\']').dispatchEvent(new Event('input'));
    element.querySelector('input[formControlName=\'namefield\']').value = 'something';
    element.querySelector('input[formControlName=\'namefield\']').dispatchEvent(new Event('input'));
    fixture.detectChanges();

    element.querySelector('form button[type=\'submit\']').click();
    expect(dspy).toHaveBeenCalledWith('collectionname','something',undefined);
  })

  it('should delete a collection', () => {
    const dspy = spyOn(fixture.debugElement.injector.get(DatabaseService), 'delete');
    element.querySelectorAll('button.delete')[1].dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(dspy).toHaveBeenCalledWith(dummyDbCollections[1]);
  });

  it('should refresh after deleting a collection', fakeAsync(() => {
    element.querySelectorAll('button.delete')[1].dispatchEvent(new Event('click'));
    fixture.detectChanges();
    tick(2000);
    fixture.detectChanges();
    expect(element.querySelectorAll('div.collectionList span').length).toBe(dummyDbCollections.length);
  }));
});
