import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EmployerJobsComponent } from './employer-job-posting.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { EmployerService } from './employer-job-posting.service';
import { BrowseJobsService } from '../browse-jobs/browse-jobs.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('EmployerJobsComponent', () => {
  let component: EmployerJobsComponent;
  let fixture: ComponentFixture<EmployerJobsComponent>;
  let employerService: jasmine.SpyObj<EmployerService>;
  let router: Router;
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

  beforeEach(waitForAsync (() => {
    const employerJobsComponentSpy = jasmine.createSpyObj('EmployerService', [
      'getEmployerJobPostings',
      'deleteEmployerJobPostings',
    ]);

    TestBed.configureTestingModule({
      declarations: [ EmployerJobsComponent ],
      imports : [
        HttpClientTestingModule, 
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: EmployerService, useValue: employerJobsComponentSpy }, // Use EmployerService, not EmployerJobsComponent
        { provide: Router, useValue: {
          navigate: jasmine.createSpy('navigateByUrl'),
          navigateByUrl: jasmine.createSpy('navigateByUrl')
        }},
        { provide: ToastrService, useValue: toastrSpy },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ userId: '123', email: 'test@example.com' }));
    fixture = TestBed.createComponent(EmployerJobsComponent);
    component = fixture.componentInstance;
    employerService = TestBed.inject(EmployerService) as jasmine.SpyObj<EmployerService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve all jobs on ngOnInit', () => {
    const mockJobs = { content: [{
      "description": "Work with frontend team to develop a highly scalable web app",
      "employerId": "64ad482c8eda5e12c342472e",
      "id": "64b5b8d3507b801b549c690d",
      "location": "Toronto / Montreal",
      "position": "Backend engineer",
      "requirements": "2+ years experience in any backend framework",
     },
      {
        "description": "Immediately joining",
        "employerId": "64ad482c8eda5e12c342472e",
        "id": "64b68289c653ef350e8de5d8",
        "location": "Toronto",
        "position": "sde 3",
        "requirements": "Java,AWS and CI/CD"
      }]
    }

    employerService.getEmployerJobPostings.and.returnValue(of(mockJobs));

    component.ngOnInit();

    expect(employerService.getEmployerJobPostings).toHaveBeenCalled();
    expect(component.jobsList).toEqual(mockJobs.content);
  });
  
  it('should update currentJobId and navigate to update-job-posting', () => {
    const jobId = 123;
    component.updateJob(jobId);

    expect(localStorage.getItem('currentJobId')).toBe(jobId.toString());
    expect(router.navigate).toHaveBeenCalledWith(['update-job-posting']);
  });

  it('should delete a job and update jobsList', () => {
    const jobId = 123;
    spyOn(window, 'confirm').and.returnValue(true);
    employerService.deleteEmployerJobPostings.and.returnValue(of('Deleted'));

    component.deleteJob(jobId);

    expect(employerService.deleteEmployerJobPostings).toHaveBeenCalledWith(jobId);
    expect(component.jobsList).toEqual([]);
    expect(toastrSpy.success).toHaveBeenCalledWith('SuccessDeleted');
  });

  it('should update currentJobId and navigate to employer-job-detail', () => {
    const jobId = 123;
    component.showDetails(jobId);

    expect(localStorage.getItem('currentJobId')).toBe(jobId.toString());
    expect(router.navigate).toHaveBeenCalledWith(['employer-job-detail']);
  });

});

