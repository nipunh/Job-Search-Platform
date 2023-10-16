import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminAllEmployersService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllEmployers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/employer`) as Observable<any>;
  }

  getEmployer(employerId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/employer/${employerId}`) as Observable<any>;
  }

  deleteEmployer(empId: any): Observable<any> {
    console.log("deleteEmployer() called with empId: " + empId)
    return this.http.delete(`${this.baseUrl}/employer/${empId}`) as Observable<any>;
  }
}
