import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from "@angular/core";
import {AuthService} from "../auth/auth.service";
import {environment} from "../../../environments/environment";
import {map, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  currentUser$() {
    return this.http.get(`${environment.apiUrl}/user/current`);
  }
}
