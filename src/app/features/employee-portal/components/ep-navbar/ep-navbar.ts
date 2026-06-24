import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ep-navbar',
  imports: [CommonModule],
  templateUrl: './ep-navbar.html',
  styleUrl: './ep-navbar.css',
})
export class EpNavbar implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);

  public username: string = '';
  public role: string = 'Employee';
  public systemName: string = 'HRMS';

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    this.systemName = localStorage.getItem('settings_system_name') || 'HRMS';
    this.role = this.authService.getRoleFromToken() || 'Employee';
  }

  getAvatarText(): string {
    return this.username ? this.username.substring(0, 1).toUpperCase() : 'E';
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
