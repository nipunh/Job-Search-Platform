import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { EmployerJobDetailComponent } from './employer-job-details.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EmployerJobDetailService } from './employer-job-details.service';
import { EmployerService } from '../employer-job-posting/employer-job-posting.service';
import { CreateProfileService } from '../create-profile/create-profile.service';

describe('EmployerJobDetailComponent', () => {
  let component: EmployerJobDetailComponent;
  let fixture: ComponentFixture<EmployerJobDetailComponent>;
  let employerJobDetailService: jasmine.SpyObj<EmployerJobDetailService>;
  let employerService: jasmine.SpyObj<EmployerService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  let createProfileServiceSpy: jasmine.SpyObj<CreateProfileService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const jobDetailServiceSpy = jasmine.createSpyObj('EmployerJobDetailService', [
      'getJobPostingsDetails',
      'getCandidateListForCurrentJob',
      'updateCandidateStatus',
    ]);
    const employerServiceSpy = jasmine.createSpyObj('EmployerService', ['deleteEmployerJobPostings']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const createProfileService = jasmine.createSpyObj('CreateProfileService', ['downloadResume']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [EmployerJobDetailComponent],
      providers: [
        { provide: EmployerJobDetailService, useValue: jobDetailServiceSpy },
        { provide: EmployerService, useValue: employerServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: CreateProfileService, useValue: createProfileService },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployerJobDetailComponent);
    component = fixture.componentInstance;
    employerJobDetailService = TestBed.inject(EmployerJobDetailService) as jasmine.SpyObj<EmployerJobDetailService>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    createProfileServiceSpy = TestBed.inject(CreateProfileService) as jasmine.SpyObj<CreateProfileService>;
    router = TestBed.inject(Router);
  }));

  // ... Other test cases ...

  it('should navigate to update-job-posting route on updateJob', () => {
    const jobId = 123;
    component.updateJob(jobId);
    expect(localStorage.getItem('currentJobId')).toBe(jobId.toString());
    expect(router.navigate).toHaveBeenCalledWith(['update-job-posting']);
  });

  it('should download the resume when calling downloadResume', fakeAsync(() => {
    const userId = '789';
    const resumeBlob = new Blob(['PDF content'], { type: 'application/pdf' });
    createProfileServiceSpy.downloadResume.and.returnValue(of(resumeBlob));
    const createObjectURLSpy = spyOn(window.URL, 'createObjectURL').and.returnValue('mock-url');
    const linkClickSpy = spyOn(document.createElement('a'), 'click');
  
    component.downloadResume(userId);
  
    tick();
  
    expect(createObjectURLSpy).toHaveBeenCalledWith(resumeBlob);
    // expect(linkClickSpy).toHaveBeenCalled();
    expect(toastrServiceSpy.error).not.toHaveBeenCalled();
  }));

  // it('should show error toastr when downloadResume API call fails', fakeAsync(() => {
  //   const userId = '789';
  //   const errorMessage = 'API error';
  //   createProfileServiceSpy.downloadResume.and.returnValue(throwError({ message: errorMessage }));
  //   spyOn(console, 'error'); // Suppressing console error output for the test
  
  //   component.downloadResume(userId);
  
  //   tick();
  
  //   expect(toastrServiceSpy.error).toHaveBeenCalledWith('Resume download failed', 'Download Failed');
  //   expect(console.error).toHaveBeenCalledWith('Error occurred while downloading resume:', errorMessage);
  // }));

  // ... Other test cases ...

});
