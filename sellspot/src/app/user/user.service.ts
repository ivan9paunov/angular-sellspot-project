import { Injectable } from '@angular/core';
import { User, UserData } from '../types/user';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user$$ = new BehaviorSubject<User | null>(null);
  private user$ = this.user$$.asObservable();

  USER_KEY = '[user]';
  user: User | null = null;

  get isLogged(): boolean {
    return !!this.user;
  }

  get userData(): UserData {
    const username = this.user?.username!;
    const email = this.user?.email!;

    return { username, email };
  }

  constructor(private http: HttpClient) {
    this.user$.subscribe((user) => {
      this.user = user;
    });
  }

  login(email: string, password: string) {
    return this.http
      .post<User>('/api/users/login', { email, password })
      .pipe(tap((user) => this.user$$.next(user)));
  }

  register(username: string, email: string, password: string) {
    return this.http
      .post<User>('/api/users/register', { username, email, password })
      .pipe(tap((user) => this.user$$.next(user)));
  }

  logout() {
    return this.http
      .get('/api/users/logout', {})
      .pipe(tap((user) => {
        localStorage.removeItem('X-Authorization');
        this.user$$.next(null);
      }));
  }

  getProfile() {
    return this.http
      .get<User>('/api/users/me')
      .pipe(tap((user) => this.user$$.next(user)));
  }
}
