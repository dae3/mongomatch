import { Component, OnInit } from '@angular/core';
import { CollectionComponent } from '../collection/collection.component';
import { ResultGridComponent } from '../result-grid/result-grid.component';
import { DatabaseService } from '../database.service';
import { Observable } from 'rxjs';

class collectionSelectData {
  name: string;
  value: string;
}

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css']
})
export class CollectionListComponent implements OnInit  {

  private collections : Array<string> = [];
  private comparisonResult : Array<object> = [];
  private collection1 : string;
  private collection2 : string;

	constructor(private db : DatabaseService) {
		db.loading.subscribe((isLoading) => {
			if (!isLoading) {
				this.dbLoad();
			}
		})
	}

  public compare() {
    this.db.compare(this.collection1, this.collection2)
    .subscribe(r=>this.comparisonResult = r);
  }

  public collectionSelectData() : Array<collectionSelectData> {
    var r = [{ name: 'Choose a collection', value: undefined }];
    Array.prototype.push.apply(r, this.collections.map((c)=>{ return { name: c, value: c } }))
    return r;
  }

  public get readyToCompare() : boolean {
    return (this.collection1 != undefined && this.collection2 != undefined);
  }

  public selectionChanged(event) {
    const v = event.target.value;
    this[event.target.id] = v == "" ? undefined : v;
  }

	dbLoad() {
    this.db.getAllCollections().subscribe(
      collectionNames => collectionNames.forEach(
        c => this.collections.push(c)
      )
    );
	}

  ngOnInit() {
		this.dbLoad();
  }

}
