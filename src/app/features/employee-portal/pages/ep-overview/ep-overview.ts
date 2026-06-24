import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeePortalService } from '../../../../core/services/employee-portal.service';
import { Auth } from '../../../../core/services/auth';
import { EmployeeService } from '../../../../core/services/employee.service';

@Component({
  selector: 'app-ep-overview',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './ep-overview.html',
  styleUrl: './ep-overview.css',
})
export class EpOverview implements OnInit {
  private portalService = inject(EmployeePortalService);
  private employeeService = inject(EmployeeService);
  private authService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  public stats: any = null;
  public empProfile: any = null;
  public isLoading = true;
  public username = '';
  public empId = '';
  public today = new Date();

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    this.empId = this.authService.getEmpIdFromToken();
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    // Try loading from portal endpoint if we have empId
    if (this.empId) {
      this.portalService.getEmployeeStats(this.empId).subscribe({
        next: (res: any) => {
          if (res && res.data) {
            this.stats = res.data;
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // Fallback: find employee by username from employee list
      this.employeeService.getEmployees(1, 100).subscribe({
        next: (res: any) => {
          if (res && res.data) {
            const match = res.data.find((e: any) =>
              e.email?.toLowerCase().includes(this.username.toLowerCase()) ||
              e.name?.toLowerCase() === this.username.toLowerCase()
            );
            if (match) {
              this.empProfile = match;
              this.empId = match.id;
              this.portalService.getEmployeeStats(match.id).subscribe({
                next: (r: any) => {
                  if (r && r.data) this.stats = r.data;
                  this.isLoading = false;
                  this.cdr.detectChanges();
                },
                error: () => { this.isLoading = false; this.cdr.detectChanges(); }
              });
            } else {
              this.isLoading = false;
              this.cdr.detectChanges();
            }
          }
        },
        error: () => { this.isLoading = false; this.cdr.detectChanges(); }
      });
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }
}
