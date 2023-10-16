import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmployerService } from './employer-job-posting.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-browse-jobs',
  templateUrl: './employer-job-posting.component.html',
  styleUrls: ['./employer-job-posting.component.scss']
})
export class EmployerJobsComponent implements OnInit {

  public employerJobInfo: any;
  loggedUser: any; // Variable to store the logged-in user details
  jobsList: any[] = [];

  constructor(private employerSevice: EmployerService, private router : Router, private toastr: ToastrService ){}

  ngOnInit(): void {
    this.loggedUser = localStorage.getItem("user");
    this.loggedUser = JSON.parse(this.loggedUser);

    this.employerSevice.getEmployerJobPostings(this.loggedUser.userId).subscribe(
      (data) => {
        this.employerJobInfo = data;
        console.warn(data);
        this.jobsList.push(...this.employerJobInfo.content);
      },
      (error) => {
        this.toastr.error('Error occured' + error.message);
      }
    );
  }
  
  updateJob(jobId: number) {
    console.log('applyToJob() called with jobId: ' + jobId);
    localStorage.setItem("currentJobId", jobId.toString());
    this.router.navigate(['update-job-posting']);
  }

  deleteJob(jobId: number) {
    console.log('deleteJob() called with jobId: ' + jobId);
    this.employerSevice.deleteEmployerJobPostings(jobId).subscribe(
      (data) => {
        this.jobsList = this.jobsList.filter((jobs) => jobs.id !== jobId);
        this.toastr.success('Success' + data);
      },
      (error) => {
        this.toastr.error('Error occured' + error.message);
      }
    );
  }

  showDetails(jobId: number){
    console.log('showDetails() called with jobId: ' + jobId);
    localStorage.setItem("currentJobId", jobId.toString());
    this.router.navigate(['employer-job-detail']);
  }
}
