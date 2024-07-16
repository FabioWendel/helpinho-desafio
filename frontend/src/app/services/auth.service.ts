import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserSignin, UserSignup } from '../models/user.model';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public user$: Observable<any> = this.userSubject.asObservable();
  apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {}

  public get userValue(): any {
    return this.userSubject.value;
  }

  login(user: UserSignin): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(
      tap((response) => {
        if (response && response.token && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', response.user);
          localStorage.setItem('id', response.id);
          this.userSubject.next(response);
        }
      })
    );
  }

  register(user: UserSignup): Observable<any> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('id');
    this.router.navigate(['/signin']);
  }
}

export const isLoggedIn = () => {
  return !!localStorage.getItem('token') && !!localStorage.getItem('user');
};

export const loggedName = () => {
  return localStorage.getItem('user') || '';
};
