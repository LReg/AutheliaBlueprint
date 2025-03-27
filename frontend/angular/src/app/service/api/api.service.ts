import { HttpClient} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient) {}

  currentUser$() {
    return this.http.get(`${environment.apiUrl}/user/current`);
  }
}
