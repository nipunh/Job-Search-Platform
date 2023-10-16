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
import { AdminAllEmployersComponent } from './admin-all-employers.component';
import { AdminAllEmployersService } from './admin-all-employers.service';

describe('AdminAllEmployersComponent', () => {
  let component: AdminAllEmployersComponent;
  let fixture: ComponentFixture<AdminAllEmployersComponent>;
  let adminAllEmployersService: jasmine.SpyObj<AdminAllEmployersService>;
  let router: Router;
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

  beforeEach(waitForAsync (() => {
    const adminAllEmployersServiceSpy = jasmine.createSpyObj('AdminAllEmployersService', [
      'getAllEmployers',
      'getEmployer',
      'deleteEmployer',
    ]);

    TestBed.configureTestingModule({
      declarations: [ AdminAllEmployersComponent ],
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
        { provide: AdminAllEmployersService, useValue: adminAllEmployersServiceSpy },
        { provide: Router, useValue: {
          navigate: jasmine.createSpy('navigateByUrl'), navigateByUrl: jasmine.createSpy('navigateByUrl')
        }},
        { provide: ToastrService, useValue: toastrSpy },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ userId: '123', email: 'test@example.com' }));
    fixture = TestBed.createComponent(AdminAllEmployersComponent);
    component = fixture.componentInstance;
    adminAllEmployersService = TestBed.inject(AdminAllEmployersService) as jasmine.SpyObj<AdminAllEmployersService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should navigate to /home if user is not logged in', () => {
  //   // Reset the localStorage to simulate a non-logged-in user
  //   localStorage.removeItem('user');

  //   // Call ngOnInit
  //   component.ngOnInit();

  //   // Expect the Router.navigate method to be called with the '/home' route
  //   expect(router.navigate).toHaveBeenCalledWith(['/home']);
  // });

  it('should retrieve all employers on ngOnInit', () => {
    const mockEmployers = [{ id: 1, name: 'Employer 1' }, { id: 2, name: 'Employer 2' }];
    adminAllEmployersService.getAllEmployers.and.returnValue(of(mockEmployers));

    component.ngOnInit();

    expect(adminAllEmployersService.getAllEmployers).toHaveBeenCalled();
    expect(component.employersListOriginal).toEqual(mockEmployers);
    expect(component.employersList).toEqual(mockEmployers);
  });

  it('should show error toastr when getAllEmployers API call fails', () => {
    const errorMessage = 'API error';
    adminAllEmployersService.getAllEmployers.and.returnValue(throwError({ message: errorMessage }));

    component.ngOnInit();

    expect(toastrSpy.error).toHaveBeenCalledWith('Error occured' + errorMessage);
  });

  it('should reset the search keyword and filter attribute on onFilterAttributeChange', () => {
    component.searchForm.get('searchKeyword')?.setValue('searchValue');
    component.onFilterAttributeChange();
    expect(component.searchForm.get('searchKeyword')?.value).toBe('');
    expect(component.employersList).toEqual(component.employersListOriginal);
  });

  it('should filter employers on onSearchInputChange', () => {
    const mockEmployers = [
      { id: 1, companyName: 'ABC Corp' },
      { id: 2, companyName: 'XYZ Company' },
    ];
    component.employersListOriginal = mockEmployers;
    component.onSearchInputChange();

    expect(component.employersList).toEqual(mockEmployers);

    // Search for 'ABC'
    component.searchForm.get('searchKeyword')?.setValue('ABC');
    component.onSearchInputChange();

    expect(component.employersList).toEqual([{ id: 1, companyName: 'ABC Corp' }]);
  });

  // it('should call getEmployer and navigate to my-profile on updateEmp', () => {
  //   const empId = 123;
  //   const mockEmployer = { id: empId, name: 'Employer 123' };
  //   adminAllEmployersService.getEmployer.and.returnValue(of(mockEmployer));

  //   component.updateEmp(empId);

  //   expect(adminAllEmployersService.getEmployer).toHaveBeenCalledWith(empId);
  //   expect(localStorage.setItem).toHaveBeenCalledWith('adminUserUpdate', JSON.stringify(mockEmployer));
  //   expect(router.navigate).toHaveBeenCalledWith(['my-profile']);
  // });

  it('should show error toastr when getEmployer API call fails', () => {
    const empId = 123;
    const errorMessage = 'API error';
    adminAllEmployersService.getEmployer.and.returnValue(throwError({ message: errorMessage }));

    component.updateEmp(empId);

    expect(toastrSpy.error).toHaveBeenCalledWith('Error occured' + errorMessage);
  });

  it('should call deleteEmployer and update employersList on deleteEmp', () => {
    const empId = 123;
    const mockResponse = { message: 'Employer deleted successfully' };
    adminAllEmployersService.deleteEmployer.and.returnValue(of(mockResponse));

    component.employersList = [{ id: 1, name: 'Employer 1' }, { id: empId, name: 'Employer 123' }, { id: 2, name: 'Employer 2' }];
    component.deleteEmp(empId);

    expect(adminAllEmployersService.deleteEmployer).toHaveBeenCalledWith(empId);
    expect(component.employersList).toEqual([{ id: 1, name: 'Employer 1' }, { id: empId, name: 'Employer 123' }, { id: 2, name: 'Employer 2' }]);
    expect(toastrSpy.success).toHaveBeenCalledWith(mockResponse.message);
  });

  it('should show error toastr when deleteEmployer API call fails', () => {
    const empId = 123;
    const errorMessage = 'API error';
    adminAllEmployersService.deleteEmployer.and.returnValue(throwError({ message: errorMessage }));

    component.deleteEmp(empId);

    expect(toastrSpy.error).toHaveBeenCalledWith('Error occured: ' + errorMessage);
  });
});
