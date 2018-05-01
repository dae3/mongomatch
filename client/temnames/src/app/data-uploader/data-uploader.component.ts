import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DatabaseService } from '../database.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-data-uploader',
  templateUrl: './data-uploader.component.html',
  styleUrls: ['./data-uploader.component.css']
})
export class DataUploaderComponent implements OnInit {

  constructor(private db: DatabaseService, private fb: FormBuilder) {
    this.upload =   this.fb.group({
      name: ['', Validators.required ],
      namefield: ['', Validators.required ],
      fileValidator: [ '', Validators.required ]
    });
 }

  private eltInvalid(name: string) : boolean {
    return this.upload.get(name).invalid;
  }

  private fileChanged(event) {
    if (event.target.files.length > 0) {
      this.upload.get('fileValidator').setValue(event.target.files[0].name);
    }
  }

  @ViewChild('realfile', {read:ElementRef}) realfile : ElementRef;
  private collections : Array<string> = [];
  private upload : FormGroup;

  private submit() {
    this.db.upload(
      this.upload.get('name').value,
      this.upload.get('namefield').value,
      this.realfile.nativeElement.files[0]
    ).subscribe(()=>console.log('u/pdone'));
  }

  private delete(event) {
    this.db.delete(event.target.value).subscribe(r=>this.loadCollectionsFromDb());
  }

  private loadCollectionsFromDb() {
    this.collections = [];
    this.db.getAllCollections().subscribe(
      collectionNames => collectionNames.forEach( c => this.collections.push(c) )
    );
  }

  ngOnInit() {
    this.loadCollectionsFromDb();
  }

}
