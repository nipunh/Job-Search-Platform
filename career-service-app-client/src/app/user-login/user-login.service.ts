import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { Authority } from 'src/constants';

@Injectable({
  providedIn: 'root'
})

export class UserLoginService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  loginUser(userProfile: any, authority: any): Observable<any> {
    if (authority === Authority.CANDIDATE)
      return this.http.post(`${this.baseUrl}/candidate/login`, userProfile, { responseType: 'json' }) as Observable<any>;
    else if (authority === Authority.EMPLOYER)
      return this.http.post(`${this.baseUrl}/employer/login`, userProfile, { responseType: 'json' }) as Observable<any>;
    else
      return this.http.post(`${this.baseUrl}/admin/login`, userProfile, { responseType: 'json' }) as Observable<any>;
  }
}