import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  public settings = {
    systemName: 'HRMS',
    defaultPageSize: 10,
    theme: 'light',
    timezone: 'UTC+05:30',
    emailNotifications: true,
  };

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    const savedSysName = localStorage.getItem('settings_system_name');
    const savedPageSize = localStorage.getItem('settings_page_size');
    const savedTheme = localStorage.getItem('settings_theme');
    const savedTimezone = localStorage.getItem('settings_timezone');
    const savedNotifications = localStorage.getItem('settings_notifications');

    if (savedSysName) this.settings.systemName = savedSysName;
    if (savedPageSize) this.settings.defaultPageSize = parseInt(savedPageSize, 10);
    if (savedTheme) this.settings.theme = savedTheme;
    if (savedTimezone) this.settings.timezone = savedTimezone;
    if (savedNotifications) this.settings.emailNotifications = savedNotifications === 'true';

    this.applyTheme(this.settings.theme);
    this.cdr.detectChanges();
  }

  saveSettings(): void {
    localStorage.setItem('settings_system_name', this.settings.systemName);
    localStorage.setItem('settings_page_size', this.settings.defaultPageSize.toString());
    localStorage.setItem('settings_theme', this.settings.theme);
    localStorage.setItem('settings_timezone', this.settings.timezone);
    localStorage.setItem('settings_notifications', this.settings.emailNotifications.toString());

    this.applyTheme(this.settings.theme);
    alert("Settings saved successfully!");
  }

  applyTheme(theme: string): void {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }
}
