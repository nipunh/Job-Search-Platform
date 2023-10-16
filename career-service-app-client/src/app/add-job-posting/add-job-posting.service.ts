import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddJobService {
  jobId = "";
  private baseUrl = "http://localhost:8080/api/v1/employer";

  constructor(private http: HttpClient, private router : Router) {
    this.jobId = this.router.getCurrentNavigation()?.extras?.state?.["jobId"];
  }

   addJobPosting(employerId: String, formData: any) : Observable<any> {
    return this.http.post( `${this.baseUrl}/jobs`, formData, {responseType: 'text'}) as Observable<any>;
  }

}
