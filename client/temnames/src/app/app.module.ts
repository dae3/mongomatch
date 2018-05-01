import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataUploaderComponent } from './data-uploader/data-uploader.component';
import { DatabaseService } from './database.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CollectionComponent } from './collection/collection.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { ResultGridComponent } from './result-grid/result-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    DataUploaderComponent,
    CollectionComponent,
    CollectionListComponent,
    ResultGridComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule
  ],
  bootstrap: [AppComponent],
  providers: [
    DatabaseService //,
    // { provide: HTTP_INTERCEPTORS, useClass: httpObserver, multi: true },
   ]
})
export class AppModule {
  ngOnInit() {

  }
}
