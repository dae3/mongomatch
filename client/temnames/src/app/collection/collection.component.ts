import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseService, DatabaseApiResponse } from '../database.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})

export class CollectionComponent implements OnInit {

  private data : Array<Object> = [];
  private keys : Array<string> = [];
  constructor(private db : DatabaseService) { }
  private _selected : boolean = false;
  public get selected() { return this._selected }
  public set selected(v:boolean) {
    this._selected = v;
    this.selectionChanged.emit(v);
  }
  @Output() public selectionChanged : EventEmitter<boolean> = new EventEmitter();
  public get numCollections() { return this.data.length }
  private _collectionName : string;
  public get collectionName() : string { return this._collectionName; }
  @Input()
  public set collectionName(val : string) {
    this._collectionName = val;
    this.db.getCollection(this._collectionName).subscribe(
      d => { this.data = d; this.keys = Object.keys(this.data[0]) }
    );
  }

}
