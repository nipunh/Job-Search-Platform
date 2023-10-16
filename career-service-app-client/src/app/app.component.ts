import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Authority } from 'src/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'career-service-app-client';

  constructor(public _router: Router) { }
  
  loggedUser: any; // Variable to store the logged-in user details
  Authority: any;
  
  ngOnInit(): void {
    this.loggedUser = localStorage.getItem("user"); // Get user data from local storage
    this.loggedUser = JSON.parse(this.loggedUser)
    this.Authority = Authority
  }

  logout() {
    localStorage.clear(); // Clear the user data from local storage
    this._router.navigateByUrl('/home'); // Navigate to the login page
    setTimeout( () => window.location.reload(), 500)
  }

}
