import { Component, OnInit } from '@angular/core';
import { DbapiModule } from '../dbapi/dbapi.module';
import { CollectionService } from '../dbapi/collection.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})

export class CollectionComponent implements OnInit {

  private name : String = "";

  constructor(collectionService : CollectionService) { }

  ngOnInit() {
  }

}
