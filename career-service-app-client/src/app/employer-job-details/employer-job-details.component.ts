import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmployerJobDetailService } from './employer-job-details.service';
import { EmployerJobsComponent } from '../employer-job-posting/employer-job-posting.component';
import { EmployerService } from '../employer-job-posting/employer-job-posting.service';
import { Status } from 'src/constants';
import { CreateProfileService } from '../create-profile/create-profile.service';

@Component({
  selector: 'app-browse-jobs',
  templateUrl: './employer-job-details.component.html',
  styleUrls: ['./employer-job-details.component.scss']
})
export class EmployerJobDetailComponent implements OnInit {

  public employerJobInfo: any;
  modal = false;
  loggedUser: any;
  currentJobId: any; // Variable to store the logged-in user details
  candidateList: any[] = [];
  job : any;
  applicationStatuses : any;
  statusChanged = {
    userId : "",
    status : ""
  };
  blob : any

  constructor(private employerJobDetailSevice: EmployerJobDetailService,  
    private employerSevice: EmployerService,
    private toastr: ToastrService,
    private router : Router,
    private createProfileService: CreateProfileService
    ){}

  ngOnInit(): void {
    this.applicationStatuses = Status;
    this.loggedUser = localStorage.getItem("user");
    this.currentJobId = localStorage.getItem("currentJobId");
    this.loggedUser = JSON.parse(this.loggedUser);
    this.employerJobDetailSevice.getJobPostingsDetails(this.currentJobId).subscribe(
      (data) => {
        this.job = data;
        console.warn(data);
      },
      (error) => {

      }
    );
    this.employerJobDetailSevice.getCandidateListForCurrentJob(this.loggedUser.userId, this.currentJobId).subscribe(
        (data) => {
          this.employerJobInfo = data;
          this.candidateList.push(...this.employerJobInfo.candidates);
          console.warn(this.employerJobInfo.candidates);
        },
        (error) => {
          this.toastr.error('Error' + error.message);
        }
      );

  }
  
  updateJob(jobId: number) {
    console.log('applyToJob() called with jobId: ' + jobId);
    localStorage.setItem("currentJobId", jobId.toString());
    this.router.navigate(['update-job-posting']);
  }
  
  downloadResume(userId : any){
    this.createProfileService.downloadResume(userId).subscribe(
      (res: any) => {
        this.blob = new Blob([res], {type: 'application/pdf'});
        var downloadURL = window.URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "resume.pdf";
        link.click();
      },
      (error: any) => { 
        this.toastr.error('Resume download failed', 'Download Failed');
      }
    );
  }

  deleteJob(jobId: number) {
    console.log('deleteJob() called with jobId: ' + jobId);
    this.employerSevice.deleteEmployerJobPostings(jobId).subscribe(
      (data) => {
        this.toastr.error('Success' + data);
      },
      (error) => {
        this.toastr.error('Error' + error.message);
      }
    );
  }

  onApplicationStatusChange(candidate: any, value:string) {
    console.log(`Application status changed for ${candidate.firstName} to ${value}`);
    this.statusChanged.userId = candidate.userId;
    this.statusChanged.status = value;
  }

  // Function to save the updated application status
  saveApplicationStatus(candidate: any, jobId : any) {
    console.log(`Saving application status ${candidate.status} for ${candidate.firstName}`);
    this.employerJobDetailSevice.updateCandidateStatus(candidate.userId, jobId, this.statusChanged.status).subscribe(
      (data) => {
        console.log(data);
        this.statusChanged = { 
            userId : "",
            status : ""
          };
        
        this.toastr.success(data);
      },
      (error) => {
        console.log(error);
        this.toastr.error('Error' + error.message);
      }
    ); 
  }
}
