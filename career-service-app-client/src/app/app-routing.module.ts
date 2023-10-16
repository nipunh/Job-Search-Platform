import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { BrowseJobsComponent } from './browse-jobs/browse-jobs.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { AddJobPostingComponent } from './add-job-posting/add-job-posting.component';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';
import { EmployerJobsComponent } from './employer-job-posting/employer-job-posting.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { EmployerJobDetailComponent } from './employer-job-details/employer-job-details.component';
import { UpdateJobPostingComponent } from './update-job-posting/update-job-posting.component';
import { AdminAllCandidatesComponent } from './admin-all-candidates/admin-all-candidates.component';
import { AdminAllEmployersComponent } from './admin-all-employers/admin-all-employers.component';
import { AdminAllJobsComponent } from './admin-all-jobs/admin-all-jobs.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: "home", component: HomePageComponent },
  { path: "login", component: UserLoginComponent },
  { path: "signup", component: UserSignupComponent },
  { path: "browse-job-postings", component: BrowseJobsComponent },
  { path: "employer-job-posting", component: EmployerJobsComponent },
  { path: "employer-job-detail", component: EmployerJobDetailComponent},
  { path: "my-profile", component: CreateProfileComponent },
  { path: "add-job-posting", component: AddJobPostingComponent },
  { path: "update-job-posting", component: UpdateJobPostingComponent },
  { path: "applied-jobs", component: AppliedJobsComponent },
  { path: "admin-all-candidates", component: AdminAllCandidatesComponent },
  { path: "admin-all-employers", component: AdminAllEmployersComponent },
  { path: "admin-all-postings", component: AdminAllJobsComponent },
  { path: "**", redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
