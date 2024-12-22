import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedOut$: Observable<boolean> | undefined;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn$=this.authService.currentUser().pipe(map(user=>!!user));
  }

  logOut(){
    this.authService.logOut();
    this.router.navigateByUrl('login');
  }

}
