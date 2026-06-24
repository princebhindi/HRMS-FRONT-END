import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../../core/services/auth';
import { OverviewService } from '../../../../core/services/overview.service';
import { LeaveService } from '../../../../core/services/leave.service';
import { AttendanceService } from '../../../../core/services/attendance.service';
import { DepartmentService } from '../../../../core/services/department.service';
import { NoticeService } from '../../../../core/services/notice.service';

import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  imports: [DatePipe, CommonModule, RouterLink],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview implements OnInit {
  private overviewService: any = inject(OverviewService);
  private leaveService: any = inject(LeaveService);
  private attendanceService = inject(AttendanceService);
  private departmentService = inject(DepartmentService);
  private noticeService = inject(NoticeService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  public dashboard: any;
  public totalEmployee: any;
  public pendingLeavesCount: any;
  public leaveRequest: any;
  public todayAttendanceList: any[] = [];
  public departmentsList: any[] = [];
  public noticesList: any[] = [];

  ngOnInit(): void {
    this.getDashboardState();
    this.getLeaveRequest();
    this.loadTodayAttendance();
    this.loadDepartments();
    this.loadNotices();
  }

  //Pending Leave Requests
  getLeaveRequest() {
    this.leaveService.getLeaveRequest().subscribe({
      next: (res: any) => {
        this.leaveRequest = res.data.filter((req: any) => req.isPending === true);
        console.log("Leave Request", this.leaveRequest);
        if (this.leaveRequest && this.leaveRequest.length > 0) {
          console.log("date is Request", this.leaveRequest[0].startDate);
        }
        this.cdr.detectChanges();
      }
    })
  }

  approvedLeave(id: any) {
    const leaveDto = {
      id: id,
      empId: this.leaveRequest.employee?.empId,
      startDate: this.leaveRequest[0]?.startDate,
      endDate: this.leaveRequest[0]?.endDate,
      isApproved: true

    };
    console.log("Leave DTO",leaveDto)

    this.leaveService.approveLeaveRequest(leaveDto).subscribe({
      next: (res: any) => {
        alert("Leave Approved successfully");
        this.getLeaveRequest();
      }
    })

  }
  rejectedLeave(id: any) {

    const leaveDto = {
      id: id,
      startDate: this.leaveRequest.startDate,
      endDate: this.leaveRequest.endDate,
      isApproved: false

    };
    this.leaveService.rejectLeaveRequest(leaveDto).subscribe({
      next: (res: any) => {
        alert("Leave rejected successfully");
        this.getLeaveRequest();
      }
    })

  }

  getDashboardState() {
    this.overviewService.dashboardstate().subscribe({
      next: (res: any) => {
        this.dashboard = res.data;
        this.totalEmployee = this.dashboard.totalEmployees;
        this.pendingLeavesCount = this.dashboard.pendingLeavesCount;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error("Error fetching dashboard data", err);
      }
    });
  }

  loadTodayAttendance(): void {
    this.attendanceService.getAttendanceLogs(1, 100).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const todayStr = new Date().toDateString();
          // Filter logs where date is today
          this.todayAttendanceList = res.data.filter((log: any) => {
            return log.date && new Date(log.date).toDateString() === todayStr;
          });
          console.log("Today's Attendance:", this.todayAttendanceList);
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error("Error loading attendance for overview", err);
      }
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments(1, 100).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.departmentsList = res.data;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error("Error loading departments for overview", err);
      }
    });
  }

  getDepartmentName(deptId: string): string {
    if (!deptId) return 'Unassigned';
    const dept = this.departmentsList.find(d => d.id === deptId);
    return dept ? (dept.name || dept.departmentName || 'Unassigned') : 'Unassigned';
  }

  loadNotices(): void {
    this.noticeService.getNotices(1, 3).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.noticesList = res.data;
          console.log("Overview notices loaded: ", this.noticesList);
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error("Error loading notices for overview", err);
      }
    });
  }
}