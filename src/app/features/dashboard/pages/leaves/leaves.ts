import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LeaveService } from '../../../../core/services/leave.service';

@Component({
  selector: 'app-leaves',
  imports: [CommonModule, DatePipe],
  templateUrl: './leaves.html',
  styleUrl: './leaves.css',
})
export class Leaves implements OnInit {
  private leaveService = inject(LeaveService);
  private cdr = inject(ChangeDetectorRef);
  
  public leavesList: any[] = [];
  public currentPage: number = 1;
  public pageSize: number = 10;
  public hasNextPage: boolean = true;

  ngOnInit(): void {
    const savedPageSize = localStorage.getItem('settings_page_size');
    if (savedPageSize) {
      this.pageSize = parseInt(savedPageSize, 10);
    }
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.leaveService.getLeaveRequest(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.leavesList = res.data;
          console.log("Leaves page data: ", this.leavesList);
          // If we receive less than 10 items, we know there's no next page.
          this.hasNextPage = this.leavesList.length === this.pageSize;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error("Error loading leaves", err);
      }
    });
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadLeaves();
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadLeaves();
    }
  }

  approveLeave(leave: any): void {
    const leaveDto = {
      id: leave.id,
      empId: leave.empId,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      isApproved: true,
      isRejected: false,
      isPending: false
    };

    this.leaveService.approveLeaveRequest(leaveDto).subscribe({
      next: (res: any) => {
        alert("Leave approved successfully");
        this.loadLeaves();
      },
      error: (err: any) => {
        console.error("Error approving leave", err);
      }
    });
  }

  rejectLeave(leave: any): void {
    const leaveDto = {
      id: leave.id,
      empId: leave.empId,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      isApproved: false,
      isRejected: true,
      isPending: false
    };

    this.leaveService.rejectLeaveRequest(leaveDto).subscribe({
      next: (res: any) => {
        alert("Leave rejected successfully");
        this.loadLeaves();
      },
      error: (err: any) => {
        console.error("Error rejecting leave", err);
      }
    });
  }
}
