import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataUploaderComponent } from './data-uploader/data-uploader.component';
import { CollectionComponent } from './collection/collection.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { ResultGridComponent } from './result-grid/result-grid.component';
import { DatabaseService } from './database.service';
import { SpinnerService, ObservableInjector } from './spinner.service';

@NgModule({
  declarations: [
    AppComponent,
    DataUploaderComponent,
    CollectionComponent,
    CollectionListComponent,
    ResultGridComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule
  ],
  bootstrap: [AppComponent],
  providers: [
    DatabaseService,
    SpinnerService,
    { provide: HTTP_INTERCEPTORS, useClass: ObservableInjector, multi: true }
   ]
})
export class AppModule {
  ngOnInit() {

  }
}
