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
import { AdminAllCandidatesComponent } from './admin-all-candidates.component';
import { AdminAllCandidatesService } from './admin-all-candidates.service';

describe('AdminAllCandidatesComponent', () => {
  let component: AdminAllCandidatesComponent;
  let fixture: ComponentFixture<AdminAllCandidatesComponent>;
  let adminCandidateService: jasmine.SpyObj<AdminAllCandidatesService>;
  let router: Router;
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

  beforeEach(waitForAsync(() => {
    const adminCandidateServiceSpy = jasmine.createSpyObj('AdminAllCandidatesService', [
      'getAllCandidates',
      'getCandidate',
      'deleteCandidate',
    ]);

    TestBed.configureTestingModule({
      declarations: [AdminAllCandidatesComponent],
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
        { provide: AdminAllCandidatesService, useValue: adminCandidateServiceSpy },
        { provide: Router, useValue: {
          navigate: jasmine.createSpy('navigateByUrl'), navigateByUrl: jasmine.createSpy('navigateByUrl')
        }},
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ userId: '123', email: 'test@example.com' }));
    fixture = TestBed.createComponent(AdminAllCandidatesComponent);
    component = fixture.componentInstance;
    adminCandidateService = TestBed.inject(AdminAllCandidatesService) as jasmine.SpyObj<AdminAllCandidatesService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should navigate to /home if user is not logged in', () => {
  //   localStorage.removeItem('user');
  //   component.ngOnInit();
  //   expect(router.navigate).toHaveBeenCalled();
  // });

  it('should load candidates list on ngOnInit', () => {
    const candidatesListStubValue: any = {
      content: [
        {
          userId: '64b41fe599ae077a7d27d10e',
          firstName: 'John',
          lastName: 'Doe',
          education: 'Masters',
          experience: 4,
        },
      ],
    };
    adminCandidateService.getAllCandidates.and.returnValue(of(candidatesListStubValue));

    component.ngOnInit();

    expect(component.candidatesListOriginal).toEqual(candidatesListStubValue.content);
    expect(component.candidatesList).toEqual(candidatesListStubValue.content);
  });

  it('should filter candidates list based on the selected attribute', () => {
    component.candidatesListOriginal = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' },
    ];

    component.searchForm.get('filterAttribute')?.setValue('lastName');
    component.searchForm.get('searchKeyword')?.setValue('Smith');
    component.onSearchInputChange();

    expect(component.candidatesList).toEqual([{ firstName: 'Jane', lastName: 'Smith' }]);
  });

  it('should reset search keyword and show original candidates list on filter attribute change', () => {
    component.candidatesListOriginal = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' },
    ];
    component.searchForm.get('filterAttribute')?.setValue('lastName');
    component.searchForm.get('searchKeyword')?.setValue('Smith');
    component.onFilterAttributeChange();

    expect(component.searchForm.get('searchKeyword')?.value).toBe('');
    expect(component.candidatesList).toEqual(component.candidatesListOriginal);
  });

  it('should update candidate and navigate to my-profile', () => {
    const candidateId = 123;
    const candidateData = {
      userId: '64b41fe599ae077a7d27d10e',
      firstName: 'John',
      lastName: 'Doe',
      authority: 'Candidate',
    };
    adminCandidateService.getCandidate.and.returnValue(of(candidateData));

    component.updateCandidate(candidateId);

    expect(localStorage.getItem('adminUserUpdate')).toBe(JSON.stringify(candidateData));
    expect(router.navigate).toHaveBeenCalledWith(['my-profile']);
  });

  it('should show error toastr when updateCandidate API call fails', () => {
    const candidateId = 123;
    adminCandidateService.getCandidate.and.returnValue(throwError({message:'API error'}));

    component.updateCandidate(candidateId);

    expect(toastrSpy.error).toHaveBeenCalledWith('Error occuredAPI error');
  });

  it('should delete candidate and update candidatesList', () => {
    const candidateId = 123;
    const deleteResponse = { message: 'Candidate deleted successfully' };
    component.candidatesList = [
      { userId: '64b41fe599ae077a7d27d10e', firstName: 'John', lastName: 'Doe' },
      { userId: '64b6ad52a80a982141ed2fee', firstName: 'Jane', lastName: 'Smith' },
    ];
    adminCandidateService.deleteCandidate.and.returnValue(of(deleteResponse));

    component.deleteCandidate(candidateId);

    expect(component.candidatesList.length).toBe(2);
    expect(toastrSpy.success).toHaveBeenCalledWith(deleteResponse);
  });

  it('should show error toastr when deleteCandidate API call fails', () => {
    const candidateId = 123;
    adminCandidateService.deleteCandidate.and.returnValue(throwError({message: 'API error'}));

    component.deleteCandidate(candidateId);

    expect(toastrSpy.error).toHaveBeenCalledWith('Error occured: API error');
  });
});
