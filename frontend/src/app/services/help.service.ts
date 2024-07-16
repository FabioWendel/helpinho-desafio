import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Help } from '../models/help.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HelpService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(help: FormData): Observable<any> {
    return this.http.post<Help>(`${this.apiUrl}/Help`, help);
  }

  getHelpers(): Observable<Help[]> {
    return this.http.get<Help[]>(`${this.apiUrl}/Help`);
  }

  getMyHelpers(id: string): Observable<Help[]> {
    return this.http.get<Help[]>(`${this.apiUrl}/Helprs/${id}`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Help/${id}`);
  }
}
