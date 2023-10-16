import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AdminAllEmployersService } from './admin-all-employers.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-all-employers',
  templateUrl: './admin-all-employers.component.html',
  styleUrls: ['./admin-all-employers.component.scss']
})
export class AdminAllEmployersComponent implements OnInit {

  searchForm: FormGroup = this.formBuilder.group({
    searchKeyword: [''],
    filterAttribute: ['companyName'],
  });

  public employerJobInfo: any;
  loggedUser: any; // Variable to store the logged-in user details
  employersListOriginal: any[] = [];
  employersList: any[] = [];

  constructor(private adminEmployerService: AdminAllEmployersService, private router : Router, private toastr: ToastrService, private formBuilder: FormBuilder){}

  ngOnInit(): void {
    this.loggedUser = localStorage.getItem("user");
    this.loggedUser = JSON.parse(this.loggedUser);
    if (this.loggedUser == null) {
      this.router.navigateByUrl('/home');
    }

    this.adminEmployerService.getAllEmployers().subscribe(
      (data: any) => {
        this.employersListOriginal = data;
        this.employersList = data;
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
    this.employersList = this.employersListOriginal;
  }

  onSearchInputChange() {
    console.log('onSearchInputChange() called');
    let searchKeyword = this.searchForm.get('searchKeyword')?.value;
    let filterAttribute = this.searchForm.get('filterAttribute')?.value;
    this.employersList = this.employersListOriginal.filter((candidate) => {
      if (candidate[filterAttribute] && candidate[filterAttribute].toString().toLowerCase().includes(searchKeyword.toLowerCase())) {
        return true;
      }
      return false;
    });
  }

  updateEmp(empId: number) {
    console.log('updateEmp() called with empId: ' + empId);
    this.adminEmployerService.getEmployer(empId).subscribe(
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

  deleteEmp(empId: number) {
    console.log('deleteEmp() called with jobId: ' + empId);
    this.adminEmployerService.deleteEmployer(empId).subscribe(
      (data) => {
        this.employersList = this.employersList.filter((emp) => emp.employerId !== empId);
        this.toastr.success(data.message);
      },
      (error) => {
        this.toastr.error('Error occured: ' + error.message);
      }
    );
  }

}
