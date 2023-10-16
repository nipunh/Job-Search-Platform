import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppliedJobsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllAppliedJobs(candidateId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/${candidateId}/applications`) as Observable<any>;
  }

  getEmployer(employerId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/employer/${employerId}`) as Observable<any>;
  }

  getJob(jobId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/jobs/${jobId}`) as Observable<any>;
  }

  getCandidate(candidateId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/${candidateId}`) as Observable<any>;
  }
}
