import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, Sidebar, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  ngOnInit(): void {
    const savedTheme = localStorage.getItem('settings_theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }
}
