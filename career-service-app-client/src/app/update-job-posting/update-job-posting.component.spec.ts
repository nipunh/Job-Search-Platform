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
import { UpdateJobPostingComponent } from './update-job-posting.component';
import { UpdateJobService } from './update-job-posting.service';
import { EmployerJobDetailService } from '../employer-job-details/employer-job-details.service';

describe('UpdateJobPostingComponent', () => {
  let component: UpdateJobPostingComponent;
  let fixture: ComponentFixture<UpdateJobPostingComponent>;
  let updateJobService: jasmine.SpyObj<UpdateJobService>;
  let employerJobDetailService: jasmine.SpyObj<EmployerJobDetailService>;
  let router: Router;
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

  beforeEach(waitForAsync(() => {
    const updateJobServiceSpy = jasmine.createSpyObj('UpdateJobService', [
      'updateJobPosting',
    ]);

    const employerJobDetailServiceSpy = jasmine.createSpyObj('EmployerJobDetailService', [
      'getJobPostingsDetails',
    ]);

    TestBed.configureTestingModule({
      declarations: [UpdateJobPostingComponent],
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
        { provide: UpdateJobService, useValue: updateJobServiceSpy },
        { provide: EmployerJobDetailService, useValue: employerJobDetailServiceSpy },
        { provide: Router, useValue: {
          navigate: jasmine.createSpy('navigateByUrl'),
        }},
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ userId: '123', email: 'test@example.com' }));
    localStorage.setItem('currentJobId', '456');
    fixture = TestBed.createComponent(UpdateJobPostingComponent);
    component = fixture.componentInstance;
    updateJobService = TestBed.inject(UpdateJobService) as jasmine.SpyObj<UpdateJobService>;
    employerJobDetailService = TestBed.inject(EmployerJobDetailService) as jasmine.SpyObj<EmployerJobDetailService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form with job details on ngOnInit', () => {
    const mockJobDetails = {
      "description": "Work with frontend team to develop a highly scalable web application",
      "location": "Toronto / Montreal",
      "position": "Backend engineer",
      "requirements": "2+ years experience in any backend framework, Java/Python preferred"
   
    };
    employerJobDetailService.getJobPostingsDetails.and.returnValue(of(mockJobDetails));

    component.ngOnInit();

    expect(component.employerJobInfo).toEqual(mockJobDetails);
    expect(component.jobPostingForm.value).toEqual(mockJobDetails);
  });

  // it('should submit valid form', () => {
  //   const mockJobId = '456';
  //   const mockFormData = { 
  //     "description": "Work with frontend team to develop a highly scalable web application",
  //     "location": "Toronto / Montreal",
  //     "position": "Backend engineer",
  //     "requirements": "2+ years experience in any backend framework, Java/Python preferred"
   
  //   };
  //   const mockResponse = 'Job posting updated';

  //   updateJobService.updateJobPosting.and.returnValue(of(mockResponse));

  //   component.jobPostingForm.setValue(mockFormData);
  //   component.onSubmit();

  //   expect(updateJobService.updateJobPosting).toHaveBeenCalledWith(mockJobId, mockFormData);
  //   expect(toastrSpy.success).toHaveBeenCalledWith('Success' + mockResponse);
  //   expect(router.navigate).toHaveBeenCalledWith(['employer-job-posting']);
  // });

  it('should show error for invalid form submission', () => {
    component.jobPostingForm.setErrors({ someError: true });
    component.onSubmit();

    expect(toastrSpy.error).toHaveBeenCalledWith('Error');
  });

  it('should show error on job details retrieval failure', () => {
    const mockError = { message: 'Failed to retrieve job details' };
    employerJobDetailService.getJobPostingsDetails.and.returnValue(throwError(mockError));

    component.ngOnInit();

    expect(toastrSpy.error).toHaveBeenCalledWith('Error' + mockError.message);
  });

  it('should show error on job update failure', () => {
    const mockError = { message: 'Failed to update job' };
    updateJobService.updateJobPosting.and.returnValue(throwError(mockError));

    component.jobPostingForm.setValue({ 
      "description": "Work with frontend team to develop a highly scalable web application",
      "location": "Toronto / Montreal",
      "position": "Backend engineer",
      "requirements": "2+ years experience in any backend framework, Java/Python preferred"
     });
    component.onSubmit();

    expect(toastrSpy.error).toHaveBeenCalledWith('Error' + mockError.message);
  });
});
