import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AdminAllCandidatesService } from './admin-all-candidates.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-all-candidates',
  templateUrl: './admin-all-candidates.component.html',
  styleUrls: ['./admin-all-candidates.component.scss']
})
export class AdminAllCandidatesComponent implements OnInit {

  searchForm: FormGroup = this.formBuilder.group({
    searchKeyword: [''],
    filterAttribute: ['firstName'],
  });

  public employerJobInfo: any;
  loggedUser: any; // Variable to store the logged-in user details
  candidatesListOriginal: any[] = [];
  candidatesList: any[] = [];

  constructor(private adminCandidateService: AdminAllCandidatesService, private router : Router, private toastr: ToastrService, private formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.loggedUser = localStorage.getItem("user");
    this.loggedUser = JSON.parse(this.loggedUser);
    if (this.loggedUser == null) {
      this.router.navigateByUrl('/home');
    }

    this.adminCandidateService.getAllCandidates().subscribe(
      (data: any) => {
        this.candidatesListOriginal = data.content;
        this.candidatesList = data.content;
        console.warn(data);
      },
      (error: any) => {
        this.toastr.error('Error occured' + error.message);
      }
    );
  }

  onFilterAttributeChange() {
    console.log('onFilterAttributeChange() called');
    this.searchForm.get('searchKeyword')?.setValue('');
    this.candidatesList = this.candidatesListOriginal;
  }

  onSearchInputChange() {
    console.log('onSearchInputChange() called');
    let searchKeyword = this.searchForm.get('searchKeyword')?.value;
    let filterAttribute = this.searchForm.get('filterAttribute')?.value;
    this.candidatesList = this.candidatesListOriginal.filter((candidate) => {
      if (candidate[filterAttribute] && candidate[filterAttribute].toString().toLowerCase().includes(searchKeyword.toLowerCase())) {
        return true;
      }
      return false;
    });
  }

  updateCandidate(candidateId: number) {
    console.log('updateCandidate() called with empId: ' + candidateId);
    this.adminCandidateService.getCandidate(candidateId).subscribe(
      (data: any) => {
        console.info(data);
        data.authority = data.authority.substring(5,6).toUpperCase() + data.authority.substring(6).toLowerCase()
        localStorage.setItem("adminUserUpdate", JSON.stringify(data))
        this.router.navigate(['my-profile'])
      },
      (error: any) => {
        this.toastr.error('Error occured' + error.message);
      }
    );
  }

  deleteCandidate(candidateId: number) {
    console.log('deleteCandidate() called with candidateId: ' + candidateId);
    this.adminCandidateService.deleteCandidate(candidateId).subscribe(
      (data) => {
        this.candidatesList = this.candidatesList.filter((emp) => emp.userId !== candidateId);
        this.toastr.success(data);
      },
      (error) => {
        this.toastr.error('Error occured: ' + error.message);
      }
    );
  }

}
