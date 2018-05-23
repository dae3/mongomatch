import { tick, flush, fakeAsync, async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatabaseService } from '../database.service';
import { of } from 'rxjs/observable/of';
import { DataUploaderComponent } from './data-uploader.component';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

describe('DataUploaderComponent', () => {
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
    upload: (name: string, sheetname: string, namefield: string, file: File) => of({status:'ok', collection:[]})
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

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should show a list of collections', () => {
      const cols = () => element.querySelectorAll('div.collectionList span');

      expect(cols().length).toBe(dummyDbCollections.length);
  });

  xit('should enable the upload button when the form is complete', () => {
    const submit = () => (element.querySelector('form button[type=\'submit\']') as HTMLButtonElement);

    expect(submit().disabled).toBeTruthy();

    (element.querySelector('input[formControlName=\'name\']') as HTMLInputElement).value = 'collectionname';
    element.querySelector('input[formControlName=\'name\']').dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(submit().disabled).toBeTruthy();

    (element.querySelector('input[formControlName=\'fileValidator\']') as HTMLInputElement).value = 'something';
    element.querySelector('input[formControlName=\'fileValidator\']').dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(submit().disabled).toBeTruthy();

    (element.querySelector('input[formControlName=\'namefield\']') as HTMLInputElement).value = 'something';
    element.querySelector('input[formControlName=\'namefield\']').dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(submit().disabled).toBeTruthy();

    (element.querySelector('input[formControlName=\'sheetname\']') as HTMLInputElement).value = 'sheetname';
    element.querySelector('input[formControlName=\'sheetname\']').dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(submit().disabled).not.toBeTruthy();
  });

  it('should upload a collection and refresh', fakeAsync(() => {
    // can't manipulate the file input control programmaticaly so just poke
    // a dummy valid into the  hidden validator field and expect an undefined
    // file on the  database call
		var dbs = fixture.debugElement.injector.get(DatabaseService);
    const dspy = spyOn(dbs, 'upload').and.returnValue(of('foo'));
		dbs.getAllCollections = jasmine.createSpy()
			.and.returnValue(of(['one','two','three']), of(['one','two','three','four']));

		setFormInput(element, 'name', 'collectionname');
		setFormInput(element, 'fileValidator', 'something');
		setFormInput(element, 'namefield', 'namefield');
		setFormInput(element, 'sheetname', 'sheetname');
    fixture.detectChanges();

		var nCol = element.querySelectorAll('div.collectionList span').length;

    (element.querySelector('form button[type=\'submit\']') as HTMLButtonElement).click();
    expect(dspy).toHaveBeenCalledWith('collectionname','sheetname','namefield',undefined);
		tick();
		fixture.detectChanges();
		expect(dbs.getAllCollections).toHaveBeenCalled();
  }));

	function setFormInput(rootElement: HTMLElement, fieldName: string, value: string) {
		var e = rootElement.querySelector(`input[formControlName='${fieldName}']`) as HTMLInputElement;
		e.value = value;
		e.dispatchEvent(new Event('input'));
	}

  xit('should delete a collection', () => {
    const dspy = spyOn(fixture.debugElement.injector.get(DatabaseService), 'delete');
    element.querySelectorAll('button.delete')[1].dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(dspy).toHaveBeenCalledWith(dummyDbCollections[1]);
  });

  xit('should refresh after deleting a collection', fakeAsync(() => {
    element.querySelectorAll('button.delete')[1].dispatchEvent(new Event('click'));
    fixture.detectChanges();
    tick(2000);
    fixture.detectChanges();
    expect(element.querySelectorAll('div.collectionList span').length).toBe(dummyDbCollections.length);
  }));
});
