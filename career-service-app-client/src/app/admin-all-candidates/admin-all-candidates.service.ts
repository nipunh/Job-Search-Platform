import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminAllCandidatesService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllCandidates(): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/allCandidates`) as Observable<any>;
  }

  getCandidate(candidateId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/${candidateId}`) as Observable<any>;
  }

  deleteCandidate(candidateId: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/candidate/${candidateId}`, {responseType: 'text'});
  }
}
