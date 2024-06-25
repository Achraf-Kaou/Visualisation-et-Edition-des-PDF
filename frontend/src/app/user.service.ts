import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { map, debounceTime, startWith } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  permission: string[];
}

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private _filter = new FormControl('');
  private baseUrl = '/api/users';

  constructor(private http: HttpClient) { }

  /* login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/users/login`, { email, password });
  } */

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}`, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  get filter(): FormControl {
    return this._filter;
  }

  getUsersFiltered(filterValue: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`).pipe(
      map(users => users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`;
        return fullName.toLowerCase().includes(filterValue.toLowerCase());
      }))
    );
  }
}
