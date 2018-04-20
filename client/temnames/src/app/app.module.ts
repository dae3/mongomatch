import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DataUploaderComponent } from './data-uploader/data-uploader.component';
import { DatabaseService } from './database.service';
import { HttpClientModule } from '@angular/common/http';
import { CollectionComponent } from './collection/collection.component';

@NgModule({
  declarations: [
    AppComponent,
    DataUploaderComponent,
    CollectionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent],
  providers: [ DatabaseService ]
})
export class AppModule {
  ngOnInit() {
    
  }
}
