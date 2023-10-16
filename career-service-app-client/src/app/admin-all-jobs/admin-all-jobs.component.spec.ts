import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AdminAllJobsComponent } from './admin-all-jobs.component';
import { BrowseJobsService } from '../browse-jobs/browse-jobs.service';
import { EmployerService } from '../employer-job-posting/employer-job-posting.service';

describe('AdminAllJobsComponent', () => {
  let component: AdminAllJobsComponent;
  let fixture: ComponentFixture<AdminAllJobsComponent>;
  let browseJobsService: jasmine.SpyObj<BrowseJobsService>;
  let employerService: jasmine.SpyObj<EmployerService>;
  let router: Router;
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

  beforeEach(waitForAsync(() => {
    const browseJobsServiceSpy = jasmine.createSpyObj('BrowseJobsService', [
      'getAllJobs',
    ]);
    const employerServiceSpy = jasmine.createSpyObj('EmployerService', [
      'deleteEmployerJobPostings',
    ]);

    TestBed.configureTestingModule({
      declarations: [ AdminAllJobsComponent ],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: BrowseJobsService, useValue: browseJobsServiceSpy },
        { provide: EmployerService, useValue: employerServiceSpy },
        { provide: Router, useValue: {
          navigate: jasmine.createSpy('navigateByUrl'), navigateByUrl: jasmine.createSpy('navigateByUrl')
        }},
        { provide: ToastrService, useValue: toastrSpy },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ userId: '123', email: 'test@example.com' }));
    fixture = TestBed.createComponent(AdminAllJobsComponent);
    component = fixture.componentInstance;
    browseJobsService = TestBed.inject(BrowseJobsService) as jasmine.SpyObj<BrowseJobsService>;
    employerService = TestBed.inject(EmployerService) as jasmine.SpyObj<EmployerService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve all jobs on ngOnInit', () => {
    const mockJobs = { content: [{ id: 1, position: 'Job 1' }, { id: 2, position: 'Job 2' }] };
    browseJobsService.getAllJobs.and.returnValue(of(mockJobs));

    component.ngOnInit();

    expect(browseJobsService.getAllJobs).toHaveBeenCalled();
    expect(component.jobsListOriginal).toEqual(mockJobs.content);
    expect(component.jobsList).toEqual(mockJobs.content);
  });

  it('should show error toastr when getAllJobs API call fails', () => {
    const errorMessage = 'API error';
    browseJobsService.getAllJobs.and.returnValue(throwError({ message: errorMessage }));

    component.ngOnInit();

    expect(toastrSpy.error).toHaveBeenCalledWith('Error occured' + errorMessage);
  });

  it('should reset the search keyword and filter attribute on onFilterAttributeChange', () => {
    component.searchForm.get('searchKeyword')?.setValue('searchValue');
    component.onFilterAttributeChange();
    expect(component.searchForm.get('searchKeyword')?.value).toBe('');
    expect(component.jobsList).toEqual(component.jobsListOriginal);
  });

  it('should filter jobs on onSearchInputChange', () => {
    const mockJobs = [{ id: 1, position: 'Job 1' }, { id: 2, position: 'Job 2' }];
    component.jobsListOriginal = mockJobs;
    component.onSearchInputChange();

    expect(component.jobsList).toEqual(mockJobs);

    // Search for 'Job 1'
    component.searchForm.get('searchKeyword')?.setValue('Job 1');
    component.onSearchInputChange();

    expect(component.jobsList).toEqual([{ id: 1, position: 'Job 1' }]);
  });

  it('should call deleteEmployerJobPostings and update jobsList on deleteJob', () => {
    const jobId = 1;
    const mockResponse = 'Job deleted successfully';
    employerService.deleteEmployerJobPostings.and.returnValue(of(mockResponse));

    component.jobsList = [{ id: 1, position: 'Job 1' }, { id: 2, position: 'Job 2' }];
    component.deleteJob(jobId);

    expect(employerService.deleteEmployerJobPostings).toHaveBeenCalledWith(jobId);
    expect(component.jobsList).toEqual([{ id: 2, position: 'Job 2' }]);
    expect(toastrSpy.success).toHaveBeenCalledWith('Success' + mockResponse);
  });

  it('should show error toastr when deleteEmployerJobPostings API call fails', () => {
    const jobId = 1;
    const errorMessage = 'API error';
    employerService.deleteEmployerJobPostings.and.returnValue(throwError({ message: errorMessage }));

    component.deleteJob(jobId);

    expect(toastrSpy.error).toHaveBeenCalledWith('Error occured' + errorMessage);
  });

  it('should navigate to update-job-posting on updateJob', () => {
    const jobId = 1;

    component.updateJob(jobId);

    expect(router.navigate).toHaveBeenCalledWith(['update-job-posting']);
  });

  it('should navigate to employer-job-detail on showDetails', () => {
    const jobId = 1;

    component.showDetails(jobId);

    expect(router.navigate).toHaveBeenCalledWith(['employer-job-detail']);
  });

});
