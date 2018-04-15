import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { DbapiModule } from './dbapi.module';

@Injectable()
export class CollectionService {

  constructor(databaseService : DatabaseService) {
    let a = 1;
  }

  loadCollection(collectionToLoad : string) {
    // this.collectionName = collectionToLoad;
  }

}
