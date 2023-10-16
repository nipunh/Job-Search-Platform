import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployerJobDetailService {
  private baseUrl = "http://localhost:8080/api/v1/jobs";
  private baseUrl2 = "http://localhost:8080/api/v1/employer";
  private baseUrl3 = "http://localhost:8080/api/v1/candidate";

  constructor(private http: HttpClient) { }

  getJobPostingsDetails(jobId: any) {
    return this.http.get(`${this.baseUrl}/${jobId}`);
  }

  getCandidateListForCurrentJob(employerId : any, jobId: any) {
    return this.http.get(`${this.baseUrl2}/${employerId}/${jobId}/applications`);
  }

  updateCandidateStatus(candidateId : any, jobId: any, status : any) {
    return this.http.put(`${this.baseUrl3}/${candidateId}/applications/${jobId}/status`, {
      "status": status
    }, {responseType: 'text'}
    );
  }
}
