import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { BrowseJobsComponent } from './browse-jobs/browse-jobs.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { AddJobPostingComponent } from './add-job-posting/add-job-posting.component';
import { UpdateJobPostingComponent } from './update-job-posting/update-job-posting.component';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';
import { EmployerJobsComponent } from './employer-job-posting/employer-job-posting.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { FooterComponent } from './footer/footer.component';
import { EmployerJobDetailComponent } from './employer-job-details/employer-job-details.component';
import { AdminAllJobsComponent } from './admin-all-jobs/admin-all-jobs.component';
import { AdminAllEmployersComponent } from './admin-all-employers/admin-all-employers.component';
import { AdminAllCandidatesComponent } from './admin-all-candidates/admin-all-candidates.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    BrowseJobsComponent,
    CreateProfileComponent,
    AddJobPostingComponent,
    UpdateJobPostingComponent,
    AppliedJobsComponent,
    EmployerJobsComponent,
    EmployerJobDetailComponent,
    UserLoginComponent,
    UserSignupComponent,
    FooterComponent,
    AdminAllJobsComponent,
    AdminAllEmployersComponent,
    AdminAllCandidatesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatListModule,
    MatCardModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    MatDialogModule
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
