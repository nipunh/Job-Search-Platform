import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateProfileService } from './create-profile.service';
import { environment } from 'src/environments/environment';

describe('CreateProfileService', () => {
  let service: CreateProfileService;
  let httpTestingController: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CreateProfileService]
    });
    service = TestBed.inject(CreateProfileService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload a resume', () => {
    const candidateId = 1;
    const fileData = new FormData();
    service.uploadResume(candidateId, fileData).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`${baseUrl}/candidate/${candidateId}/resume/upload`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should download a resume', () => {
    const candidateId = 1;
    service.downloadResume(candidateId).subscribe(response => {
      expect(response instanceof Blob).toBeTrue();
    });

    const req = httpTestingController.expectOne(`${baseUrl}/candidate/${candidateId}/resume/download`);
    expect(req.request.method).toBe('GET');
    req.flush(new Blob());
  });

  it('should update an employer profile', () => {
    const employerId = 1;
    const formData = new FormData();
    service.updateEmployerProfile(employerId, formData).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`${baseUrl}/employer/${employerId}/profile`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should update a candidate profile', () => {
    const candidateId = 1;
    const formData = new FormData();
    service.updateCandidateProfile(candidateId, formData).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`${baseUrl}/candidate/${candidateId}/profile`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('should generate a resume', () => {
    const candidateId = 1;
    service.generateResume(candidateId).subscribe(response => {
      expect(response instanceof Blob).toBeTrue();
    });

    const req = httpTestingController.expectOne(`${baseUrl}/candidate/${candidateId}/resume/generate`);
    expect(req.request.method).toBe('GET');
    req.flush(new Blob());
  });
});
