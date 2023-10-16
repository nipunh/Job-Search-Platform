import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AddJobService } from './add-job-posting.service';


describe('AddJobService', () => {
  let service: AddJobService;
  let httpMock: HttpTestingController;
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      getCurrentNavigation: () => ({
        extras: { state: { jobId: '123' } },
      }),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AddJobService,
        { provide: Router, useValue: mockRouter }
      ],
    });

    service = TestBed.inject(AddJobService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add job posting', () => {
    const mockEmployerId = '456';
    const mockFormData = { /* mock form data */ };
    const mockResponse = 'Job posting added';

    service.addJobPosting(mockEmployerId, mockFormData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const request = httpMock.expectOne(`${service['baseUrl']}/jobs`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(mockFormData);
    request.flush(mockResponse);
  });
});
