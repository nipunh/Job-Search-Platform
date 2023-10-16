import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authority } from 'src/constants';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideInAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('1000ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
    trigger('fadeInOutAnimation', [
      transition(':enter', [
        animate('1s ease-out' , style({ opacity: 0 })),
        animate('1s ease-out', style({ opacity: 1 })),
      ]),
    ])
  ]
})
export class HomePageComponent implements OnInit {

  loggedUser: any; // Stores the logged-in user data
  Authority: any;

  constructor(private _router: Router) { }

  ngOnInit(): void {
    this.Authority = Authority;
    this.loggedUser = localStorage.getItem("user"); // Get user data from local storage
    this.loggedUser = JSON.parse(this.loggedUser); // Parse the logged-in user data
    localStorage.removeItem("authority")
  }

  login(authority: string) {
    localStorage.setItem("authority", authority)
    this._router.navigateByUrl('/login');
  }

  signup(authority: string) {
    localStorage.setItem("authority", authority)
    this._router.navigateByUrl('/signup');
  }

}
