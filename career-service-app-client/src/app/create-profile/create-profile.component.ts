import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateProfileService } from './create-profile.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BrowseJobsService } from '../browse-jobs/browse-jobs.service';
import { Authority } from 'src/constants';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit {

  candidateProfileForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    education: ['', Validators.required],
    experience: [0, Validators.required]
  });

  employerProfileForm: FormGroup = this.formBuilder.group({
    companyName: ['', Validators.required],
    website: ['', Validators.required]
  });

  selectedFile: File | null = null;

  loggedUser: any;
  adminUpdateUser: any;
  resumeId: any;
  resumeExists: any;
  Authority: any;
  updateUser: any;
  constructor(private formBuilder: FormBuilder, private createProfileService: CreateProfileService, private browseJobsService: BrowseJobsService, private _router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    // Check if the user is already logged in, if so, navigate to the home page
    this.loggedUser = null
    this.Authority = Authority
    this.loggedUser = localStorage.getItem('user')
    this.adminUpdateUser = localStorage.getItem('adminUserUpdate')
    this.loggedUser = JSON.parse(this.loggedUser)
    this.adminUpdateUser = JSON.parse(this.adminUpdateUser)
    if (this.loggedUser == null) {
      this._router.navigateByUrl('/home');
    }
    if (this.loggedUser.authority === Authority.ADMIN && this.adminUpdateUser !== null) {
      this.updateUser = this.adminUpdateUser
    } else {
      this.updateUser = this.loggedUser
    }

    if (this.loggedUser.authority === Authority.CANDIDATE) {
      this.candidateProfileForm.setValue({
        firstName: this.loggedUser.firstName,
        lastName: this.loggedUser.lastName,
        education: this.loggedUser.education,
        experience: this.loggedUser.experience
      })
    }
    if (this.loggedUser.authority === Authority.EMPLOYER) {
      this.employerProfileForm.setValue({
        companyName: this.loggedUser.companyName,
        website: this.loggedUser.website
      })
    }
    if (this.loggedUser.authority === Authority.ADMIN) {
      if (this.adminUpdateUser.authority === Authority.CANDIDATE) {
        console.info(this.adminUpdateUser)
        this.candidateProfileForm.setValue({
          firstName: this.adminUpdateUser.firstName,
          lastName: this.adminUpdateUser.lastName,
          education: this.adminUpdateUser.education,
          experience: this.adminUpdateUser.experience
        })
      }
      if (this.adminUpdateUser.authority === Authority.EMPLOYER) {
        this.employerProfileForm.setValue({
          companyName: this.adminUpdateUser.companyName,
          website: this.adminUpdateUser.website
        })
      }
    }


    if(this.loggedUser.authority === Authority.CANDIDATE || this.adminUpdateUser.authority == Authority.CANDIDATE){
    this.browseJobsService.isResumeExists(this.updateUser.userId).subscribe(
      (res: any) => {
        this.resumeExists = res
        if (this.resumeExists) {
          this.createProfileService.downloadResume(this.updateUser.userId).subscribe(
            (res: any) => {
              let url = window.URL.createObjectURL(res);
              let a = document.getElementById('downloadButton');
              if (a instanceof HTMLAnchorElement) {
                a.href = url;
                a.download = "resume.pdf";
              }
            },
            (error: any) => { 
              this.toastr.error('Resume download failed', 'Download Failed');
            }
          );
        }
      },
      (error: any) => { 
        this.toastr.error('Error occured', 'Failed');
      }
    );
  }}

  updateProfile() {
    if ((this.loggedUser.authority === Authority.CANDIDATE || this.loggedUser.authority === Authority.ADMIN) && this.candidateProfileForm.valid) {
      console.log(this.candidateProfileForm.value);
      this.createProfileService.updateCandidateProfile(this.updateUser.userId, this.candidateProfileForm.getRawValue()).subscribe(
        (res: any) => {
          if (this.loggedUser.authority === Authority.ADMIN) {
            this.updateUser.firstName = res.firstName
            this.updateUser.lastName = res.lastName
            this.updateUser.experience = res.experience
            this.updateUser.education = res.education
            this.adminUpdateUser.firstName = res.firstName
            this.adminUpdateUser.lastName = res.lastName
            this.adminUpdateUser.experience = res.experience
            this.adminUpdateUser.education = res.education
            localStorage.setItem("adminUserUpdate", JSON.stringify(this.adminUpdateUser))
          } else {
            this.loggedUser.firstName = res.firstName
            this.loggedUser.lastName = res.lastName
            this.loggedUser.experience = res.experience
            this.loggedUser.education = res.education
            localStorage.setItem("user", JSON.stringify(this.loggedUser))
          }
          this.toastr.success('Updated candidate profile successfully', 'Update successfull');
          this._router.navigateByUrl('/my-profile')
        },
        (error: any) => { 
          this.toastr.error('Update candidate profile Failed', 'Update Failed');
        }
      );
    }
    if ((this.loggedUser.authority === Authority.EMPLOYER || this.loggedUser.authority === Authority.ADMIN) && this.employerProfileForm.valid) {
      console.log(this.employerProfileForm.value);
      this.createProfileService.updateEmployerProfile(this.updateUser.userId, this.employerProfileForm.getRawValue()).subscribe(
        (res: any) => {
          if (this.loggedUser.authority === Authority.ADMIN) {
            this.updateUser.companyName = res.companyName
            this.updateUser.website = res.website
            this.adminUpdateUser.companyName = res.companyName
            this.adminUpdateUser.website = res.website
            localStorage.setItem("adminUserUpdate", JSON.stringify(this.adminUpdateUser))
          } else {
            this.loggedUser.companyName = res.companyName
            this.loggedUser.website = res.website
            localStorage.setItem("user", JSON.stringify(this.loggedUser))
          }
          this.toastr.success('Updated employer profile successfully', 'Update successfull');
          this._router.navigateByUrl('/my-profile')
        },
        (error: any) => { 
          this.toastr.error('Update employer profile Failed', 'Update Failed');
        }
      );
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      this.createProfileService.uploadResume(this.updateUser.userId, formData).subscribe(
        (response: any) => {
          this.toastr.success('Resume successfully uploaded', 'Success'); // Show success message using Toastr
          window.location.reload()
        },
        (error: any) => { 
          console.error('File upload failed', error);
        }
      );
    }
  }

  onGenerate() {
    this.createProfileService.generateResume(this.updateUser.userId).subscribe(
      (response: any) => {
        this.toastr.success('Resume successfully Generated', 'Success'); // Show success message using Toastr
        var blob = new Blob([response], {type: "application/pdf"});
        var objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl);
      },
      (error: any) => { 
        console.error('File upload failed', error);
      }
    ); 
  }

}
