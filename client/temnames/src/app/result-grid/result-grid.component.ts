import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-result-grid',
  templateUrl: './result-grid.component.html',
  styleUrls: ['./result-grid.component.css']
})
export class ResultGridComponent implements OnInit {

  @Input() public results: Array<object> = [];

  constructor() { }

  ngOnInit() {
  }

}
