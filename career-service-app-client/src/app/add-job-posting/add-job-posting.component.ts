import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddJobService } from './add-job-posting.service';
import { Router } from '@angular/router';
import { EmployerService } from '../employer-job-posting/employer-job-posting.service';
import { EmployerJobDetailService } from '../employer-job-details/employer-job-details.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-job-posting',
  templateUrl: './add-job-posting.component.html',
  styleUrls: ['./add-job-posting.component.scss']
})
export class AddJobPostingComponent implements OnInit {

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

  constructor(private formBuilder: FormBuilder, private addJobService: AddJobService, private _router: Router,private employerJobDetailSevice: EmployerJobDetailService, private toastr : ToastrService ) { }

  loggedUser: any; // Variable to store the logged-in user details
  
  ngOnInit(): void {
    this.loggedUser = localStorage.getItem("user"); // Get user data from local storage
    this.loggedUser = JSON.parse(this.loggedUser)
    this.currentJobId =  localStorage.getItem("currentJobId"); // Get user data from local storage
    this.employerId = this.loggedUser.userId;
    if (!this.loggedUser) {
      this._router.navigateByUrl('/home'); // If user is not logged in, redirect to the login page
    }
  }

  onSubmit() {
    if (this.jobPostingForm.valid) {
      console.warn("Submit : Valid Form" + this.jobPostingForm.getRawValue())
      this.request = {
        ...this.jobPostingForm.getRawValue(),
        "employerId" : this.employerId
      }
      console.log(this.request);
      this.addJobService.addJobPosting(this.employerId, this.request ).subscribe(data => {
        this.toastr.success('Job posting created successfully', data.message);
        this._router.navigate(['employer-job-posting']);
      },
      (error) => {
        this.toastr.error('Create new job posting failed', error.message);
      })
    }else{
      console.warn("Submit : Invalid Form" )
    }
  }

}
