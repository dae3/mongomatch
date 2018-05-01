import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService, DatabaseApiResponse } from '../database.service';
import { Observable  } from 'rxjs/Observable';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})

export class CollectionComponent implements OnInit {

  private data : Array<Object> = [];
  private keys : Array<string> = [];

  constructor(private db : DatabaseService) { }

  // NO: it should observe the database service
  private isLoading : boolean = false;

  public get numDocuments() { return this.data.length }

  private _name : string;
  public get name() : string { return this._name; }
  @Input()
  public set name(val : string) {
    this._name = val;
    if (this._name != undefined) {
      this.db.getCollection(this._name).subscribe(
        d => {
          this.data = d;
          this.keys = Object.keys(this.data[0]);
        }
      );
    }
  }

  ngOnInit() {}
}
