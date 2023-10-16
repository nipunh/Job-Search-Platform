import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserLoginService } from './user-login.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  formGroup: FormGroup = this.formBuilder.group({
    'emailId': [null, Validators.required], // Form control for email input field
    'password': [null, Validators.required] // Form control for password input field
  });

  loggedUser: any; // Stores the logged-in user data
  authority: any;
  constructor(private _router: Router, private formBuilder: FormBuilder, private userLoginService: UserLoginService, private toastr: ToastrService) { }

  ngOnInit(): void {
    // If user is already logged in, redirect to home page
    this.authority = localStorage.getItem("authority")
    if (localStorage.getItem("user") != null || this.authority == null) {
      this._router.navigateByUrl('/home')
    }
  }

  loginUser() {
    // Send a login request to the server with form data
    this.userLoginService.loginUser(this.formGroup.getRawValue(), this.authority).subscribe(
      (res) => {
        res.user.authority = res.user.authority.substring(5).charAt(0).toUpperCase() + res.user.authority.substring(5).toLowerCase().slice(1)
        localStorage.setItem("user", JSON.stringify(res.user)) // Store user data in local storage
        this.toastr.success('Login Successful', 'Welcome'); // Show success message using Toastr
        this._router.navigateByUrl('/home'); // Redirect to home page after successful login
        window.location.reload()
      },
      (error) => {
        this.toastr.error('Incorrect username or password', 'Login Failed'); // Show error message using Toastr
      }
    );
  }

}
