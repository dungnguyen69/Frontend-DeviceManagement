import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';
import { Router } from '@angular/router';
import { LocalService } from './services/local.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Frontend-DeviceManagement';
  isLoggedIn = false;
  roles: string[] = [];
  isAdmin = false;
  isMod = false;
  isUser = false;
  username?: string;

  constructor(private tokenStorageService: TokenStorageService, private router: Router, private localService: LocalService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorageService.isLoggedIn(); /* this.tokenStorageService.getToken() != null ? true : false. */
    this.checkLogin();
  }

  checkLogin() {
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
    if (this.isLoggedIn) {
      this.router.navigate(['/home']);
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.isAdmin = this.roles.includes('ROLE_ADMIN');
      this.isMod = this.roles.includes('ROLE_MODERATOR');
      this.isUser = this.roles.includes('ROLE_USER');
      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.logOut();
    this.localService.clearData();
    window.location.reload();
  }
}
