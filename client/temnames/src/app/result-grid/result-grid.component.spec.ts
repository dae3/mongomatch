import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultGridComponent } from './result-grid.component';

xdescribe('ResultGridComponent', () => {
  let component: ResultGridComponent;
  let fixture: ComponentFixture<ResultGridComponent>;
  let element : HTMLElement;
  const dummyCompareResult = [
    {
       _id: 1,
       somefield: 'aaa',
       name: 'John Doe',
       names: ['john','doe'],
       matchedNames: [
         { name: 'Jane Doe', score: 1 },
         { name: 'John Smith', score: 2 }
       ]
    },
    {
       _id: 2,
       somefield: 'bbb',
       name: 'Jane Smith',
       names: ['jane','smith'],
       matchedNames: [
         { name: 'John Smith', score: 3 },
         { name: 'Jane Doe', score: 4 }
       ]
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a row for each result', () => {
    const col2expected = (data : Array<object>, index: number) =>
      data[index]['matchedNames'].map((d)=>`<p>${d.name}: ${d.score}</p>`)
      .reduce((a,i)=>a+i)

    component.results = dummyCompareResult;
    fixture.detectChanges();
    expect(element.querySelectorAll('table tr').length).toBe(dummyCompareResult.length);
    var i = 0;
    element.querySelectorAll('table tr').forEach(
      row => {
        const columns = row.querySelectorAll('td');
        expect(columns[0].firstChild.textContent).toEqual(dummyCompareResult[i].name);
        expect(columns[1].querySelectorAll('p').length).toEqual(dummyCompareResult[i].matchedNames.length);
        // expect(columns[1].querySelectorAll('p').textContent).toEqual(
        //   [col2expected(dummyCompareResult, i)), col2col2expected(dummyCompareResult, i)
        i++;
      }
    )

  })


});
