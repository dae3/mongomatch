import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './database.service';
import { CollectionService } from './collection.service';

@NgModule({
  imports: [ CommonModule ],
  providers: [DatabaseService, CollectionService]
})
export class DbapiModule { }
