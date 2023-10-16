import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppliedJobsComponent } from './applied-jobs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppliedJobsService } from './applied-jobs.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('AppliedJobsComponent', () => {
  let component: AppliedJobsComponent;
  let fixture: ComponentFixture<AppliedJobsComponent>;
  let appliedJobsServiceSpy: jasmine.SpyObj<AppliedJobsService>;
  let router: Router;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(
    waitForAsync(() => {
      const appliedJobsServiceMock = jasmine.createSpyObj('AppliedJobsService', [
        'getAllAppliedJobs',
        'getEmployer',
        'getJob',
      ]);

      const toastrMock = jasmine.createSpyObj('ToastrService', ['error']);

      TestBed.configureTestingModule({
        imports: [
          ReactiveFormsModule,
          RouterTestingModule,
          HttpClientTestingModule,
          ToastrModule.forRoot()
        ],
        declarations: [AppliedJobsComponent],
        providers: [
          { provide: AppliedJobsService, useValue: appliedJobsServiceMock },
          { provide: ToastrService, useValue: toastrMock },
          { provide: Router, useValue: {
            navigate: jasmine.createSpy('navigateByUrl'), navigateByUrl: jasmine.createSpy('navigateByUrl')
          }}
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppliedJobsComponent);
    component = fixture.componentInstance;
    appliedJobsServiceSpy = TestBed.inject(AppliedJobsService) as jasmine.SpyObj<AppliedJobsService>;
    toastrSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch applied jobs on ngOnInit', () => {
    const mockAppliedJobs = [
      { employerId: '1', jobId: 'job1', status: 'Applied', id: 'app1' },
      { employerId: '2', jobId: 'job2', status: 'Shortlisted', id: 'app2' },
    ];

    const mockEmployerData = {
      "userId": "64cc03a67720fa27e5ef6bda",
      "emailId": "mananparuthi@gmail.com",
      "password": "password1234",
      "authority": "ROLE_EMPLOYER",
      "companyName": "Concordia Labs ",
      "website": "www.concordia-labs.com"
    };
    const mockJobData = {
      "id": "64ce4409bfd1bd160a0e9ede",
      "employerId": "64cc03a67720fa27e5ef6bda",
      "position": "Full Stack Software Developer",
      "description": "High Paying job at a Reputed Company",
      "location": "Montreal",
      "requirements": "Full stack skills required with masters degree"
    };

    appliedJobsServiceSpy.getAllAppliedJobs.and.returnValue(of(mockAppliedJobs));
    appliedJobsServiceSpy.getEmployer.and.returnValue(of(mockEmployerData));
    appliedJobsServiceSpy.getJob.and.returnValue(of(mockJobData));

    component.ngOnInit();

    expect(component.appliedJobsList.length).toBe(2);
  });

  it('should handle errors during applied jobs fetching', () => {
    const mockUser = { userId: '123' };
    appliedJobsServiceSpy.getAllAppliedJobs.and.returnValue(throwError('Error occurred'));

    spyOn(console, 'error'); // Spy on console.error to check if it's called
    component.ngOnInit();

    expect(toastrSpy.error).toHaveBeenCalledWith('Error occurred');
    expect(console.error).toHaveBeenCalledWith('Error occurred');
  });

});
