import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient
  ) { }

  saveToken(token: string | null): void {
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  authenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getUserId(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const token = localStorage.getItem('token');

      if (token) {
        this.http.get(`http://localhost:3000/info?token=${token}`).subscribe(response => {
          resolve(response);
        })
      } else {
        reject('error when querying user id');
      }
    })
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
