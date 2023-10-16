import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EmployerService } from './employer-job-posting.service';


describe('EmployerService', () => {
  let service: EmployerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployerService],
    });
    service = TestBed.inject(EmployerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get employer job postings', () => {
    const mockEmployerId = '123';
    const mockResponse = { /* mock employer job postings */ };

    service.getEmployerJobPostings(mockEmployerId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const request = httpMock.expectOne(`${service['baseUrl']}/${mockEmployerId}/jobs`);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });

  it('should delete employer job posting', () => {
    const mockJobId = '456';
    const mockResponse = 'Job posting deleted';

    service.deleteEmployerJobPostings(mockJobId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const request = httpMock.expectOne(`${service['baseUrl']}/jobs/${mockJobId}`);
    expect(request.request.method).toBe('DELETE');
    request.flush(mockResponse);
  });
});
