import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminAllCandidatesService } from './admin-all-candidates.service';
import { environment } from 'src/environments/environment';

describe('AdminAllCandidatesService', () => {
  let service: AdminAllCandidatesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AdminAllCandidatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all candidates', () => {
    const mockCandidates = [{ id: 1, name: 'Candidate 1' }, { id: 2, name: 'Candidate 2' }];

    service.getAllCandidates().subscribe((data) => {
      expect(data).toEqual(mockCandidates);
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/candidate/allCandidates`);
    expect(request.request.method).toBe('GET');
    request.flush(mockCandidates);
  });

  it('should retrieve a specific candidate', () => {
    const candidateId = 1;
    const mockCandidate = { id: 1, name: 'Candidate 1' };

    service.getCandidate(candidateId).subscribe((data) => {
      expect(data).toEqual(mockCandidate);
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/candidate/${candidateId}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockCandidate);
  });

  it('should delete a candidate', () => {
    const candidateId = 1;
    const mockResponse = '{ "message": "Candidate deleted successfully" }';

    service.deleteCandidate(candidateId).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/candidate/${candidateId}`);
    expect(request.request.method).toBe('DELETE');
    request.flush(mockResponse);
  });

});
