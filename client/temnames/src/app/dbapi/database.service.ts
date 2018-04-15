import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DatabaseService {
  readonly URL = "http://localhost:8081";

  constructor(private httpClient : HttpClient) { }


}
