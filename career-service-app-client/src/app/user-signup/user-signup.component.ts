import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserSignupService } from './user-signup.service';
import { Authority } from 'src/constants';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.scss']
})
export class UserSignupComponent implements OnInit {

  candidateProfileForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    emailId: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    authority: ['ROLE_CANDIDATE'],
    education: ['', Validators.required],
    experience: [0, Validators.required],
    resumeId: [null]
  });

  employerProfileForm: FormGroup = this.formBuilder.group({
    companyName: ['', Validators.required],
    website: ['', Validators.required],
    emailId: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    authority: ['ROLE_EMPLOYER']
  });

  authority: any;
  Authority: any;
  constructor(private formBuilder: FormBuilder, private userSignupService: UserSignupService, private _router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    // Check if the user is already logged in, if so, navigate to the home page
    this.Authority = Authority
    this.authority = localStorage.getItem("authority")
    if (localStorage.getItem('user') != null || this.authority == null) {
      this._router.navigateByUrl('/home');
    }
  }

  createProfile() {
    if ((this.authority === Authority.CANDIDATE && this.candidateProfileForm.valid) || (this.authority === Authority.EMPLOYER && this.employerProfileForm.valid)) {
      const roleBasedFormGroup = this.authority === Authority.CANDIDATE ? this.candidateProfileForm : (this.authority === Authority.EMPLOYER ? this.employerProfileForm : null)
      this.userSignupService.signup(this.authority, roleBasedFormGroup?.getRawValue()).subscribe(
        (res) => {
          this.toastr.success('Signup Successful', 'Welcome'); // Show success message using Toastr
          this._router.navigateByUrl('/home')
        },
        (error: any) => {
          this.toastr.error('User already exists', 'Signup Failed'); // Show error message using Toastr
        }
      )
    } else {
      return
    }
  }
}
