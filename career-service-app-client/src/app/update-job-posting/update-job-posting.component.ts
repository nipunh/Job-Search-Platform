import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateJobService } from './update-job-posting.service';
import { Router } from '@angular/router';
import { EmployerJobDetailService } from '../employer-job-details/employer-job-details.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-job-posting',
  templateUrl: './update-job-posting.component.html',
  styleUrls: ['./update-job-posting.component.scss']
})
export class UpdateJobPostingComponent implements OnInit {

  employerId = "";
  currentJobId : any; 
  request = {};
  public employerJobInfo: any;


  jobPostingForm: FormGroup = this.formBuilder.group({
    position: ['', Validators.required],
    location: ['', Validators.required],
    description: ['', Validators.required],
    requirements: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private updateJobService: UpdateJobService, private _router: Router,private employerJobDetailSevice: EmployerJobDetailService,  private toastr: ToastrService  ) { }

  loggedUser: any; // Variable to store the logged-in user details
  
  ngOnInit(): void {
    this.loggedUser = localStorage.getItem("user"); // Get user data from local storage
    this.currentJobId =  localStorage.getItem("currentJobId"); // Get user data from local storage
    if (!this.loggedUser) {
      this._router.navigateByUrl('/home'); // If user is not logged in, redirect to the login page
    }

    this.employerJobDetailSevice.getJobPostingsDetails(this.currentJobId).subscribe(
      (data) => {
        this.employerJobInfo = data;
        console.warn(this.employerJobInfo)
        this.jobPostingForm.setValue(
          {
            position : this.employerJobInfo.position, 
            location : this.employerJobInfo.location, 
            description : this.employerJobInfo.description, 
            requirements : this.employerJobInfo.requirements 
          })
      },
      (error) => {
        this.toastr.error('Error' + error.message);
      }
    );
  }

  onSubmit() {
    if (this.jobPostingForm.valid) {
      console.warn("Submit : Valid Form" + this.jobPostingForm.getRawValue())
      this.request = {
        ...this.jobPostingForm.getRawValue(),
        "employerId" : this.employerId
      }
      this.updateJobService.updateJobPosting(this.currentJobId, this.request ).subscribe(data => {
        this.toastr.success('Success' + data);
        this._router.navigate(['employer-job-posting']);
      },
      (error) => {
        console.error(error.message)
        this.toastr.error('Error' + error.message);
      })
    }else{
      console.warn("Submit : Invalid Form" )
      this.toastr.error('Error');
    }
  }

}
