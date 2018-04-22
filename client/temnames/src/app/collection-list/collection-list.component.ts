import { Component, OnInit } from '@angular/core';
import { CollectionComponent } from '../collection/collection.component';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css']
})
export class CollectionListComponent implements OnInit  {

  private collectionNames : Array<string> = [];

  constructor(private db : DatabaseService) { }

  public addCollection(name : string) { this.collectionNames.push(name); }

  ngOnInit() {
    this.db.getAllCollections().subscribe(
      collections => collections.forEach(c => this.addCollection(c))
    )
  }

}
