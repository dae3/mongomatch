import { Component } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public loading : boolean = false;

  constructor(private spinner : SpinnerService) {
    // spinner.loading.subscribe(this.subHandler);
  }

  // private subHandler(b : boolean) {
  //   console.log(`subHandler ${b} ${this.loading}`);
  //   if (b != this.loading) {
  //     console.log(`subHandler diff`);
  //     setTimeout(()=>{this.loading = b})
  //   }
  // }
}
