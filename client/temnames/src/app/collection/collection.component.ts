import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/defaultIfEmpty';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';

@Component({
	selector: 'app-collection',
	templateUrl: './collection.component.html',
	styleUrls: ['./collection.component.css'],
})

export class CollectionComponent implements OnInit {

	private data : Array<Object> = [];
	private keys : Array<string> = [];

	constructor(private db : DatabaseService) {
		db.changed.subscribe(() => this.loadData(this.name));
	}

	public get numDocuments() : number { return this.data.length }

	private _name : string;
	public get name() : string { return this._name; }
	@Input()
	public set name(val : string) {
		this._name = val;
		this.loadData(this._name);
	}

	loadData(collectionName : string) {
		const data = this.db.getAllCollections()
			.switchMap(collectionNames => from(collectionNames))  // array to Obs
			.filter(v => v == collectionName)   // exists?
			.switchMap(c => this.db.getCollection(c))  // data, or nothing
			.defaultIfEmpty([]) // default is blank
			.publish();

		data.subscribe(docs => this.data = docs);
		
		data.switchMap(docs => from(docs)) // array -> elements
			.first(v => v, (v, i) => v, {}) // take 1st, default blank
			.switchMap(doc => Object.keys(doc))  // switch to keys
			.reduce((a,v) => a.concat(v), []) 			// accumulate back to array
			.subscribe(keys => this.keys = keys);

		data.connect();
	}

	ngOnInit() {}
}
