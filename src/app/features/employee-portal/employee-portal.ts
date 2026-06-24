import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EpNavbar } from './components/ep-navbar/ep-navbar';
import { EpSidebar } from './components/ep-sidebar/ep-sidebar';

@Component({
  selector: 'app-employee-portal',
  imports: [EpNavbar, EpSidebar, RouterOutlet],
  templateUrl: './employee-portal.html',
  styleUrl: './employee-portal.css',
})
export class EmployeePortal implements OnInit {
  ngOnInit(): void {
    const savedTheme = localStorage.getItem('settings_theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }
}
