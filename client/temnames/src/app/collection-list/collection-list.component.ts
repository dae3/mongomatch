import { Component, OnInit } from '@angular/core';
import { CollectionComponent } from '../collection/collection.component';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css']
})
export class CollectionListComponent implements OnInit  {

  private collectionNames : Array<string> = [];

  constructor() { }

  public addCollection(name : string) { this.collectionNames.push(name); }

  ngOnInit() {
  }

}
