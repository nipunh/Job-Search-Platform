import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppliedJobsService } from './applied-jobs.service';
import { Application } from './../../models/Application';
import { Employer } from './../../models/Employer'; // Update the import path
import { Job } from './../../models/Job'; // Update the import path
import { Candidate } from './../../models/Candidate'; // Update the import path
import { ToastrService } from 'ngx-toastr';
import { switchMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-applied-jobs',
  templateUrl: './applied-jobs.component.html',
  styleUrls: ['./applied-jobs.component.scss']
})
export class AppliedJobsComponent implements OnInit {

  appliedJobsList: Array<Application> = [];

  constructor(
    private _router: Router,
    private appliedJobsService: AppliedJobsService,
    private toastr: ToastrService
  ) {}

  loggedUser: any; // Variable to store the logged-in user details

  ngOnInit(): void {
    this.loggedUser = localStorage.getItem("user");
    this.loggedUser = JSON.parse(this.loggedUser);
  
    if (!this.loggedUser) {
      this._router.navigateByUrl('/home');
      return;
    }
  
    this.appliedJobsService.getAllAppliedJobs(this.loggedUser.userId)
      .pipe(
        switchMap((res: any) => {
          const appliedJobsObservables = res.map((element: any) => {
            return forkJoin({
              employer: this.appliedJobsService.getEmployer(element.employerId),
              job: this.appliedJobsService.getJob(element.jobId)
            }).pipe(
              map((responses: any) => {
                const employer = responses.employer;
                const job = responses.job;
                const application: Application = {
                  id: element.id,
                  employer,
                  job,
                  status: element.status,
                  candidate: {} as Candidate // Initialize as empty object for now
                };
                return application;
              })
            );
          });
          return forkJoin(appliedJobsObservables);
        })
      )
      .subscribe(
        (value: unknown) => {
          if (Array.isArray(value)) {
            this.appliedJobsList = value as Application[];
            console.warn(this.appliedJobsList);
          } else {
            console.error('Invalid value received from observable');
            this.toastr.error('Error occurred');
            this._router.navigateByUrl('/home');
          }
        },
        (error: any) => {
          console.error(error);
          this.toastr.error('Error occurred');
          this._router.navigateByUrl('/home');
        }
      );
  }
}