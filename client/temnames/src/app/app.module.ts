import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DbapiModule } from './dbapi/dbapi.module';
import { AppComponent } from './app.component';
import { DataUploaderComponent } from './data-uploader/data-uploader.component';
import { CollectionComponent } from './collection/collection.component';

@NgModule({
  declarations: [
    AppComponent,
    DataUploaderComponent,
    CollectionComponent
  ],
  imports: [
    BrowserModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
