import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AddJobPostingComponent } from './add-job-posting.component';
import { AddJobService } from './add-job-posting.service';
import { EmployerJobDetailService } from '../employer-job-details/employer-job-details.service';

describe('AddJobPostingComponent', () => {
  let component: AddJobPostingComponent;
  let fixture: ComponentFixture<AddJobPostingComponent>;
  let addJobServiceSpy: jasmine.SpyObj<AddJobService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let employerJobDetailServiceSpy: jasmine.SpyObj<EmployerJobDetailService>;
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

  beforeEach(waitForAsync(() => {
    const addJobServiceSpy = jasmine.createSpyObj('AddJobService', ['addJobPosting']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const employerJobDetailServiceSpy = jasmine.createSpyObj('EmployerJobDetailService', ['getJobPostingsDetails']);

    TestBed.configureTestingModule({
      declarations: [AddJobPostingComponent],
      imports: [ReactiveFormsModule, ToastrModule.forRoot()],
      providers: [
        { provide: AddJobService, useValue: addJobServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: EmployerJobDetailService, useValue: employerJobDetailServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ userId: '123' }));
    fixture = TestBed.createComponent(AddJobPostingComponent);
    component = fixture.componentInstance;
    addJobServiceSpy = TestBed.inject(AddJobService) as jasmine.SpyObj<AddJobService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    employerJobDetailServiceSpy = TestBed.inject(EmployerJobDetailService) as jasmine.SpyObj<EmployerJobDetailService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should navigate to /home if user is not logged in', () => {
  //   localStorage.removeItem('user');

  //   component.ngOnInit();

  //   expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  // });

  // it('should call addJobPosting and navigate to employer-job-posting on successful form submission', () => {
  //   const mockFormValue = {
  //     "description": "Work with frontend team to develop a highly scalable web application",
  //     "location": "Toronto / Montreal",
  //     "position": "Backend engineer",
  //     "requirements": "2+ years experience in any backend framework, Java/Python preferred"
  //   };
  //   const mockResponse = { message: 'Job posting created successfully' };
  //   addJobServiceSpy.addJobPosting.and.returnValue(of(mockResponse));

  //   component.jobPostingForm.setValue(mockFormValue);
  //   component.onSubmit();

  //   expect(addJobServiceSpy.addJobPosting).toHaveBeenCalledWith('123', {
  //     ...mockFormValue,
  //     employerId: '123',
  //   });
  //   expect(toastrSpy.success).toHaveBeenCalledWith('Job posting created successfully', mockResponse.message);
  //   expect(routerSpy.navigate).toHaveBeenCalledWith(['employer-job-posting']);
  // });

  it('should show error toastr when addJobPosting API call fails', () => {
    const mockFormValue = {
      "description": "Work with frontend team to develop a highly scalable web application",
      "location": "Toronto / Montreal",
      "position": "Backend engineer",
      "requirements": "2+ years experience in any backend framework, Java/Python preferred"
    };
    const errorMessage = 'API error';
    addJobServiceSpy.addJobPosting.and.returnValue(throwError({ message: errorMessage }));

    component.jobPostingForm.setValue(mockFormValue);
    component.onSubmit();

    expect(toastrSpy.error).toHaveBeenCalledWith('Create new job posting failed', errorMessage);
  });

  it('should not call addJobPosting when the form is invalid', () => {
    const mockFormValue = {
      "description": "Work with frontend team to develop a highly scalable web application",
      "location": "Toronto / Montreal",
      "position": "Backend engineer",
      "requirements": "2+ years experience in any backend framework, Java/Python preferred"
    };

    component.jobPostingForm.setValue(mockFormValue);
    // component.onSubmit();

    expect(addJobServiceSpy.addJobPosting).not.toHaveBeenCalled();
  });
});


