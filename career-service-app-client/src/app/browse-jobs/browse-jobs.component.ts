import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BrowseJobsService } from './browse-jobs.service';
import { Job } from 'src/models/Job';
import { Employer } from 'src/models/Employer';
import { AppliedJobsService } from '../applied-jobs/applied-jobs.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-browse-jobs',
  templateUrl: './browse-jobs.component.html',
  styleUrls: ['./browse-jobs.component.scss']
})
export class BrowseJobsComponent implements OnInit {

  searchForm: FormGroup = this.formBuilder.group({
    searchKeyword: [''],
    filterAttribute: ['position'],
  });
  
  allJobsListOriginal: any[] = [];
  allJobsList: Array<Job> = []

  constructor(private toastr: ToastrService, private _router: Router, private browseJobService: BrowseJobsService, private appliedJobsService: AppliedJobsService, private formBuilder: FormBuilder) { }

  loggedUser: any; // Variable to store the logged-in user details

  ngOnInit(): void {
    this.loggedUser = localStorage.getItem("user"); // Get user data from local storage
    this.loggedUser = JSON.parse(this.loggedUser)
    if (!this.loggedUser) {
      this._router.navigateByUrl('/home'); // If user is not logged in, redirect to the home page
    }
    this.browseJobService.getAllJobs().subscribe(
      (res: any) => {
        for (let index = 0, length = res.content.length; index < length; index += 1) {
          const element = res.content[index];
          this.appliedJobsService.getEmployer(element.employerId).subscribe(
            (response: any) => {
              let job = new Job
              let employer = new Employer
              employer = response
              job.description = element.description
              job.id = element.id
              job.location = element.location
              job.position = element.position
              job.requirements = element.requirements
              job.employer = employer
              this.allJobsList.push(job)
              this.allJobsListOriginal.push(job)
            },
            (error: any) => {
              this.toastr.error('Error occured');
              this._router.navigateByUrl('/home')
            }
          );
        }
      },
      (error: any) => {
        console.error('Fetching application failed', error);
        this.toastr.error('Error occured');
      }
    );
  }

  onFilterAttributeChange() {
    console.log('onFilterAttributeChange() called');
    this.searchForm.get('searchKeyword')?.setValue('');
    this.allJobsList = this.allJobsListOriginal;
  }

  onSearchInputChange() {
    console.log('onSearchInputChange() called');
    let searchKeyword = this.searchForm.get('searchKeyword')?.value;
    let filterAttribute = this.searchForm.get('filterAttribute')?.value;
    this.allJobsList = this.allJobsListOriginal.filter((candidate) => {
      if (filterAttribute == "companyName") { candidate = candidate["employer"] }
      if (candidate[filterAttribute] && candidate[filterAttribute].toString().toLowerCase().includes(searchKeyword.toLowerCase())) {
        return true;
      }
      return false;
    });
  }

  applyToJob(jobId: string) {
    this.browseJobService.isResumeExists(this.loggedUser.userId).subscribe(
      (res: any) => {
        console.log(res)
        if (!res) {
          this.toastr.error('Please upload the resume first before applying to the job.');
          return
        }
        this.browseJobService.applyToJob(this.loggedUser.userId, jobId).subscribe(
          (res: any) => {
            this.toastr.success('Job applied successfully', 'Success'); // Show success message using Toastr
          },
          (error: any) => {
            this.toastr.error('Job application failed or Already applied for this job');
          }
        );
      },
      (error: any) => {
        this.toastr.error('Error occured');
        console.error('API call failed', error);
        return
      }
    );
  }
}
