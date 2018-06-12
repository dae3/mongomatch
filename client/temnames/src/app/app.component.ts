import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor(private db : DatabaseService) {
		db.loading.subscribe(val=>console.log(`dbl ${val}`));
	}

	ngOnInit() { }
}
