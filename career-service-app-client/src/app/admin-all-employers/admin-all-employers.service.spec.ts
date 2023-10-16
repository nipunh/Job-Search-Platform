import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminAllEmployersService } from './admin-all-employers.service';
import { environment } from 'src/environments/environment';

describe('AdminAllEmployersService', () => {
  let service: AdminAllEmployersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AdminAllEmployersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all employers', () => {
    const mockEmployers = [{ id: 1, name: 'Employer 1' }, { id: 2, name: 'Employer 2' }];

    service.getAllEmployers().subscribe((data) => {
      expect(data).toEqual(mockEmployers);
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/employer`);
    expect(request.request.method).toBe('GET');
    request.flush(mockEmployers);
  });

  it('should retrieve a specific employer', () => {
    const employerId = 1;
    const mockEmployer = { id: 1, name: 'Employer 1' };

    service.getEmployer(employerId).subscribe((data) => {
      expect(data).toEqual(mockEmployer);
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/employer/${employerId}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockEmployer);
  });

  it('should delete an employer', () => {
    const employerId = 1;
    const mockResponse = { message: 'Employer deleted successfully' };

    service.deleteEmployer(employerId).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/employer/${employerId}`);
    expect(request.request.method).toBe('DELETE');
    request.flush(mockResponse);
  });

});
