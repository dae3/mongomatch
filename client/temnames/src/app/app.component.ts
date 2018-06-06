import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private db : DatabaseService) { }
}
