import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService, DatabaseApiResponse } from '../database.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})

export class CollectionComponent implements OnInit {

  private data : Array<Object> = [];
  constructor(private db : DatabaseService) { }

  public get numCollections() { return this.data.length }
  private _collectionName : string;
  public get collectionName() : string { return this._collectionName; }
    @Input()
    public set collectionName(val : string) {
    this._collectionName = val;
    this.db.getCollection(this._collectionName).subscribe(
      d => this.data = d
    );
  }

  ngOnInit() { }

}
