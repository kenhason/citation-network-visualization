import {Injectable} from '@angular/core';
import {Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class DatabaseService {
  private BASE_URL: string = 'http://localhost:7474/db/data/transaction/commit';
  constructor(private http: Http) { }

  public get(reqOptions: RequestOptions): Observable<any> {
    return this.http.request(this.BASE_URL, reqOptions);
  }
}
