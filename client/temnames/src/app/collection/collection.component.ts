import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService, DatabaseApiResponse } from '../database.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})

export class CollectionComponent implements OnInit {

  private data : Array<Object>;

  constructor(private db : DatabaseService) { }

  private _collectionName : string;
  get collectionName() : string { return this._collectionName; }
    @Input()
    set collectionName(val : string) {
    this._collectionName = val;
    this.db.getCollection(this._collectionName).subscribe(
      d => this.data = d
    );
  }

  ngOnInit() { }

}
