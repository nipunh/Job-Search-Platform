import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BrowseJobsComponent } from './browse-jobs.component';
import { BrowseJobsService } from './browse-jobs.service';
import { AppliedJobsService } from '../applied-jobs/applied-jobs.service';

describe('BrowseJobsComponent', () => {
  let component: BrowseJobsComponent;
  let fixture: ComponentFixture<BrowseJobsComponent>;
  let browseJobsService: jasmine.SpyObj<BrowseJobsService>;
  let appliedJobsService: jasmine.SpyObj<AppliedJobsService>;
  let router: Router;
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

  beforeEach(waitForAsync( () => {
    const browseJobsSpy = jasmine.createSpyObj('BrowseJobsService', ['getAllJobs', 'isResumeExists', 'applyToJob']);
    const appliedJobsSpy = jasmine.createSpyObj('AppliedJobsService', ['getEmployer']);

    TestBed.configureTestingModule({
      declarations: [BrowseJobsComponent],
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
        { provide: BrowseJobsService, useValue: browseJobsSpy },
        { provide: AppliedJobsService, useValue: appliedJobsSpy },
        { provide: Router, useValue: {
          navigate: jasmine.createSpy('navigateByUrl'), navigateByUrl: jasmine.createSpy('navigateByUrl')
        }},
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ userId: '123', email: 'test@example.com' }));
    fixture = TestBed.createComponent(BrowseJobsComponent);
    component = fixture.componentInstance;
    browseJobsService = TestBed.inject(BrowseJobsService) as jasmine.SpyObj<BrowseJobsService>;
    appliedJobsService = TestBed.inject(AppliedJobsService) as jasmine.SpyObj<AppliedJobsService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle errors during job fetching', () => {
    const mockError = 'Error occurred';
    browseJobsService.getAllJobs.and.returnValue(throwError(mockError));

    spyOn(console, 'error'); // Spy on console.error to check if it's called
    component.ngOnInit();

    expect(toastrSpy.error).toHaveBeenCalledWith('Error occured');
    expect(console.error).toHaveBeenCalledWith('Fetching application failed', mockError);
  });

  it('should reset search keyword on filter attribute change', () => {
    component.searchForm.get('searchKeyword')?.setValue('some keyword');
    component.onFilterAttributeChange();

    expect(component.searchForm.get('searchKeyword')?.value).toEqual('');
  });

  it('should filter jobs based on search input', () => {
    // Mock data
    component.allJobsListOriginal = [
      { position: 'Developer', employer: { companyName: 'Company A' } },
      { position: 'Designer', employer: { companyName: 'Company B' } },
    ];

    // Test filter by position
    component.searchForm.get('filterAttribute')?.setValue('position');
    component.searchForm.get('searchKeyword')?.setValue('Developer');
    component.onSearchInputChange();

    expect(component.allJobsList.length).toEqual(1);
    expect(component.allJobsList[0].position).toEqual('Developer');

    // Test filter by company name
    component.searchForm.get('filterAttribute')?.setValue('companyName');
    component.searchForm.get('searchKeyword')?.setValue('Company B');
    component.onSearchInputChange();

    expect(component.allJobsList.length).toEqual(1);
    expect(component.allJobsList[0].employer.companyName).toEqual('Company B');
  });

  it('should apply to a job', fakeAsync(() => {
    // Mock data and spy behaviors
    component.loggedUser = { userId: 1 };
    const mockJobId = '123';
    browseJobsService.isResumeExists.and.returnValue(of(true));
    browseJobsService.applyToJob.and.returnValue(of({ message: 'Success' }));

    // Test applyToJob method
    component.applyToJob(mockJobId);
    tick();

    expect(browseJobsService.isResumeExists).toHaveBeenCalledWith(1);
    // expect(toastrSpy.error).not.toHaveBeenCalled();
    expect(browseJobsService.applyToJob).toHaveBeenCalledWith(1, mockJobId);
    expect(toastrSpy.success).toHaveBeenCalledWith('Job applied successfully', 'Success');
  }));

  it('should fetch all jobs on component initialization', () => {
    // Mock data
    const mockJob = { description: 'Mock Job', employerId: 1, id: '123' };
    const mockEmployer = {
      "content": [
          {
              "id": "64b5b8d3507b801b549c690d",
              "employerId": "64ad482c8eda5e12c342472e",
              "position": "Backend engineer",
              "description": "Work with frontend team to develop a highly scalable web application",
              "location": "Toronto / Montreal",
              "requirements": "2+ years experience in any backend framework, Java/Python preferred"
          },
          {
              "id": "64b68289c653ef350e8de5d8",
              "employerId": "64ad482c8eda5e12c342472e",
              "position": "sde 3",
              "description": "Immediately joining",
              "location": "Toronto",
              "requirements": "Java,AWS and CI/CD"
          },
          {
              "id": "64ce4409bfd1bd160a0e9ede",
              "employerId": "64cc03a67720fa27e5ef6bda",
              "position": "Full Stack Software Developer",
              "description": "High Paying job at a Reputed Company",
              "location": "Montreal",
              "requirements": "Full stack skills required with masters degree"
          },
          {
              "id": "64d3f1b04d13100f4192fd5f",
              "employerId": "64ad482c8eda5e12c342472e",
              "position": "JS (React, Node.JS) Developer",
              "description": "We're looking for a Senior JavaScript Developer with expertise in React and Node.js!",
              "location": "Montreal",
              "requirements": "Extensive experience in JavaScript development, with a strong focus on React and Node.js\nProficiency in front-end technologies such as HTML, CSS, and JavaScript frameworks (e.g., React, Redux)\nSolid understanding of server-side JavaScript frameworks (e.g., Express, Koa) and RESTful API development\nExperience with database systems such as MongoDB, PostgreSQL, or MySQL\nFamiliarity with version control systems (e.g., Git) and agile development methodologies\nStrong problem-solving and analytical skills\nExcellent communication and collaboration abilities"
          },
          {
              "id": "64d3f2db4d13100f4192fd60",
              "employerId": "64ad482c8eda5e12c342472e",
              "position": "Software Engineer - Intern",
              "description": "We are looking for an energetic, detail-oriented software developer to join a talented team of product marketers, software developers, and designers. ",
              "location": "Toronto, ON",
              "requirements": "Strong software development ability in either Java, C, C++, Python, algorithms and or similar\nUI building with MVC principles a plus\nKnowledge of API usage\nSolid understanding of algorithms and data structures\nEffective communication and collaborations skills"
          }
        ],
        "pageable": {
            "sort": {
                "empty": true,
                "sorted": false,
                "unsorted": true
            },
            "offset": 0,
            "pageNumber": 0,
            "pageSize": 10,
            "paged": true,
            "unpaged": false
        },
        "last": true,
        "totalElements": 5,
        "totalPages": 1,
        "size": 10,
        "number": 0,
        "sort": {
            "empty": true,
            "sorted": false,
            "unsorted": true
        },
        "numberOfElements": 5,
        "first": true,
        "empty": false
    };
    // const expectedJobList = [{ /* expected job object */ }];
    browseJobsService.getAllJobs.and.returnValue(of({ content: [mockJob] }));
    appliedJobsService.getEmployer.and.returnValue(of(mockEmployer));

    // Trigger ngOnInit
    component.ngOnInit();

    expect(browseJobsService.getAllJobs).toHaveBeenCalled();
    expect(appliedJobsService.getEmployer).toHaveBeenCalledWith(mockJob.employerId);
    // expect(component.allJobsList).toEqual(expectedJobList);
  });

});
