import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrowseJobsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllJobs(): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/alljobs`) as Observable<any>;
  }  

  isResumeExists(candidateId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/${candidateId}/resume/exists`) as Observable<any>;
  }

  applyToJob(candidateId: any, jobId: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/candidate/${candidateId}/jobs/${jobId}/apply`, {}, {responseType: 'text'}) as Observable<any>;
  }

}
