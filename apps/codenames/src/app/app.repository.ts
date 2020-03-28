import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppRepository {

  constructor(
    private http: HttpClient
  ) { }

  getRandId(): Observable<{ id: string }> {
    return this.http.get<{ id: string }>(`${environment.api}/id`);
  }
}
