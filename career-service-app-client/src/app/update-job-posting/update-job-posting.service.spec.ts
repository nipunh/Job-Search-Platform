import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UpdateJobService } from './update-job-posting.service';


describe('UpdateJobService', () => {
  let service: UpdateJobService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [UpdateJobService]
    });
    service = TestBed.inject(UpdateJobService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a PUT request to update a job posting', () => {
    const jobId = '123';
    const formData = { /* your form data here */ };
    const responseText = 'Job updated successfully';

    service.updateJobPosting(jobId, formData).subscribe(response => {
      expect(response).toBe(responseText);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/jobs/${jobId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(responseText);
  });
});
