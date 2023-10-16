import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {
  private baseUrl = "http://localhost:8080/api/v1/employer";

  constructor(private http: HttpClient) { }

  getEmployerJobPostings(employerId: any) {
    return this.http.get(`${this.baseUrl}/${employerId}/jobs`);
  }

  deleteEmployerJobPostings(jobId: any) {
    return this.http.delete(`${this.baseUrl}/jobs/${jobId}`, {responseType: 'text'});
  }
}
