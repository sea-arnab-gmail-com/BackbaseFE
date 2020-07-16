import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class BackendInteractionService {
  private static TRANSACTION_JSON_PATH: any = './assets/mock/transactions.json';
  constructor(private http: HttpClient) { }

  public getTransactions(): Observable<any> {
    return this.http.get(BackendInteractionService.TRANSACTION_JSON_PATH);
  }
}
