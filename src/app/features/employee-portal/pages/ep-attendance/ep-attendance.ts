import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-ep-attendance',
  imports: [CommonModule, DatePipe],
  templateUrl: './ep-attendance.html',
  styleUrl: './ep-attendance.css',
})
export class EpAttendance implements OnInit {
  private attendanceService = inject(AttendanceService);
  private employeeService = inject(EmployeeService);
  private authService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  public attendanceList: any[] = [];
  public isLoading = true;
  public currentPage = 1;
  public pageSize = 10;
  public hasNextPage = true;
  public empId = '';
  public username = '';

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    this.empId = this.authService.getEmpIdFromToken();
    this.loadAttendance();
  }

  loadAttendance(): void {
    this.isLoading = true;
    this.attendanceService.getAttendanceLogs(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          // Filter only this employee's records
          const all: any[] = res.data;
          this.attendanceList = this.empId
            ? all.filter((a: any) => a.empId === this.empId)
            : all;
          this.hasNextPage = res.data.length === this.pageSize;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  getStatusClass(status: string): string {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s === 'present') return 'status-present';
    if (s === 'absent') return 'status-absent';
    if (s === 'late') return 'status-late';
    return 'status-default';
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadAttendance(); }
  }

  nextPage(): void {
    if (this.hasNextPage) { this.currentPage++; this.loadAttendance(); }
  }
}
