import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateProfileComponent } from './create-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CreateProfileService } from './create-profile.service';
import { of } from 'rxjs';

describe('CreateProfileComponent', () => {
  let component: CreateProfileComponent;
  let fixture: ComponentFixture<CreateProfileComponent>;
  let createProfileServiceSpy: jasmine.SpyObj<CreateProfileService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  

  beforeEach(waitForAsync(() => {
    const createProfileServiceSpy = jasmine.createSpyObj('CreateProfileService', [
      'uploadResume',
      'downloadResume',
      'updateEmployerProfile',
      'updateCandidateProfile',
      'generateResume',
    ]);

     TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ],
      declarations: [ CreateProfileComponent ],
      providers: [
        { provide: CreateProfileService, useValue: createProfileServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    })
    .compileComponents();
  }));

    beforeEach(() => {
      fixture = TestBed.createComponent(CreateProfileComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize candidate profile form with default values', () => {
      expect(component.candidateProfileForm.value).toEqual({
          firstName: '',
          lastName: '',
          education: '',
          experience: 0
      });
});

  it('should initialize employer profile form with default values', () => {
    expect(component.employerProfileForm.value).toEqual({
        companyName: '',
        website: ''
    });
  });

//   it('should update candidate profile successfully', () => {
//     // Set up mock values
//     const routerNavigateByUrlSpy = spyOn(component['_router'], 'navigateByUrl');
//     const mockResponse = { /* mock response data */ };
//     spyOn(createProfileServiceSpy, 'updateCandidateProfile').and.returnValue(of(mockResponse));

//     // Update the candidate profile form
//     component.candidateProfileForm.setValue({
//         firstName: 'John',
//         lastName: 'Doe',
//         education: 'Bachelor Degree',
//         experience: 3,
//         email : "test@test.com"
//     });

//     // Call the updateProfile function
//     component.updateProfile();

//     // Expectations
//     expect(createProfileServiceSpy.updateCandidateProfile).toHaveBeenCalledWith(component.updateUser.userId, component.candidateProfileForm.getRawValue());
//     expect(toastrSpy.success).toHaveBeenCalledWith('Updated candidate profile successfully', 'Update successfull');
//     expect(routerNavigateByUrlSpy).toHaveBeenCalledWith('/my-profile');
// });

});
