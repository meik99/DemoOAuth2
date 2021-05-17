import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthenticationService} from "./login/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Frontend';
  authenticated = false;

  userId: any = null;
  err: any = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.authenticated = this.authService.authenticated();
    this.route.queryParamMap.subscribe(params => {
      if (params.has('token')) {
        this.authService.saveToken(params.get('token'));
        this.authenticated = this.authService.authenticated();
      }
    });
  }

  getUserId() {
    this.authService.getUserId()
      .then(userId => this.userId = userId)
      .catch(err => this.err = err);
  }

  logout() {
    this.authService.logout();
    this.authenticated = false;
    this.userId = null;
  }
}
