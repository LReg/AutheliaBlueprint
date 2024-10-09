import { Injectable } from '@angular/core';
import {LoginResponse, OidcSecurityService} from "angular-auth-oidc-client";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public initialized = new BehaviorSubject<boolean>(false);
  public loggedIn = new BehaviorSubject<boolean>(false);
  constructor(private oidcSecurityService: OidcSecurityService) {
    this.configure();
  }

  private configure() {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((loginResponse: LoginResponse) => {
        console.log('login response', loginResponse);
        this.initialized.next(true);
        if (loginResponse.isAuthenticated) {
          this.loggedIn.next(true);
        }
      });
  }

  public login() {
    this.oidcSecurityService.authorize();
  }

  public logout() {
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
  }

  public identityClaims() {
  }

  public getAccessToken(): Observable<string> {
    return this.oidcSecurityService.getAccessToken();
  }

  public getIdToken$(): Observable<string> {
    return this.oidcSecurityService.getIdToken();
  }

  public isAuthenticated(): Observable<boolean> {
    return this.oidcSecurityService.isAuthenticated();
  }
}
