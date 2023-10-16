import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Authority } from 'src/constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserSignupService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  signup(authority: any, fileData: any): Observable<any> {
    if (authority === Authority.EMPLOYER) {
      return this.http.post(`${this.baseUrl}/employer/signup`, fileData) as Observable<any>;
    }
    return this.http.post(`${this.baseUrl}/candidate/signup`, fileData) as Observable<any>;
  }

}
