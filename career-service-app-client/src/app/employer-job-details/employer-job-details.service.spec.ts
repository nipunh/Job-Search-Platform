import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EmployerJobDetailService } from './employer-job-details.service';


describe('EmployerJobDetailService', () => {
  let service: EmployerJobDetailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployerJobDetailService],
    });
    service = TestBed.inject(EmployerJobDetailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get job posting details', () => {
    const mockJobId = '123';
    const mockResponse = { /* mock job posting details */ };

    service.getJobPostingsDetails(mockJobId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const request = httpMock.expectOne(`${service['baseUrl']}/${mockJobId}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });

  it('should get candidate list for current job', () => {
    const mockEmployerId = '456';
    const mockJobId = '123';
    const mockResponse = { /* mock candidate list */ };

    service.getCandidateListForCurrentJob(mockEmployerId, mockJobId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const request = httpMock.expectOne(`${service['baseUrl2']}/${mockEmployerId}/${mockJobId}/applications`);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });

  it('should update candidate status', () => {
    const mockCandidateId = '789';
    const mockJobId = '123';
    const mockStatus = 'Accepted';
    const mockResponse = 'Status updated';

    service.updateCandidateStatus(mockCandidateId, mockJobId, mockStatus).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const request = httpMock.expectOne(`${service['baseUrl3']}/${mockCandidateId}/applications/${mockJobId}/status`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ status: mockStatus });
    request.flush(mockResponse);
  });
});
