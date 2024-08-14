import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth/auth.service";
import {ApiService} from "../../service/api/api.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  constructor(public authService: AuthService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.log();
  }

  public log() {
    this.authService.getAccessToken().subscribe(console.log);
    this.apiService.currentUser$().subscribe(console.log);
    this.authService.isAuthenticated().subscribe(console.log);
  }
}
