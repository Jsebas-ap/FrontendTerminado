import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../controllers/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-navbar',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './dashboard-navbar.html',
  styleUrl: './dashboard-navbar.scss'
})
export class DashboardNavbar {

  constructor(
    public authService: AuthService
  ){}

  logout() {
    this.authService.logout();
  }
}
