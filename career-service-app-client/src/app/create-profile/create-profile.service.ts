import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreateProfileService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadResume(candidateId: any, fileData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/candidate/${candidateId}/resume/upload`, fileData, {responseType: 'text'}) as Observable<any>;
  }

  downloadResume(candidateId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/${candidateId}/resume/download`, {responseType: 'blob'}) as Observable<any>;
  }

  updateEmployerProfile(employerId: any, formData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/employer/${employerId}/profile`, formData) as Observable<any>;
  }

  updateCandidateProfile(candidateId: any, formData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/candidate/${candidateId}/profile`, formData) as Observable<any>;
  }

  generateResume(candidateId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/${candidateId}/resume/generate`, {responseType: 'blob'}) as Observable<any>;
  }

}
