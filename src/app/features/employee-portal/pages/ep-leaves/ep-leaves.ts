import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../../../core/services/leave.service';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-ep-leaves',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './ep-leaves.html',
  styleUrl: './ep-leaves.css',
})
export class EpLeaves implements OnInit {
  private leaveService = inject(LeaveService);
  private authService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  public leaveList: any[] = [];
  public isLoading = true;
  public showForm = false;
  public currentPage = 1;
  public pageSize = 10;
  public hasNextPage = true;
  public empId = '';
  public isSaving = false;

  public leaveForm: any = {
    empId: '',
    startDate: '',
    endDate: '',
    reason: '',
    isPending: true,
    isApproved: false,
    isRejected: false
  };

  ngOnInit(): void {
    this.empId = this.authService.getEmpIdFromToken();
    this.leaveForm.empId = this.empId;
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.isLoading = true;
    this.leaveService.getLeaveRequest(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          const all: any[] = res.data;
          this.leaveList = this.empId
            ? all.filter((l: any) => l.empId === this.empId)
            : all;
          this.hasNextPage = res.data.length === this.pageSize;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  applyLeave(): void {
    if (!this.leaveForm.startDate || !this.leaveForm.endDate || !this.leaveForm.reason) {
      alert('Please fill all required fields.');
      return;
    }
    this.isSaving = true;
    this.leaveService.addLeave(this.leaveForm).subscribe({
      next: (res: any) => {
        if (res && res.sucess) {
          alert('Leave request submitted successfully!');
          this.showForm = false;
          this.resetForm();
          this.loadLeaves();
        } else {
          alert(res?.message || 'Failed to submit leave request.');
        }
        this.isSaving = false;
      },
      error: () => {
        alert('Error submitting leave. Please try again.');
        this.isSaving = false;
      }
    });
  }

  resetForm(): void {
    this.leaveForm = {
      empId: this.empId,
      startDate: '',
      endDate: '',
      reason: '',
      isPending: true,
      isApproved: false,
      isRejected: false
    };
  }

  getStatusBadge(leave: any): string {
    if (leave.isApproved) return 'approved';
    if (leave.isRejected) return 'rejected';
    if (leave.isPending) return 'pending';
    return 'default';
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.loadLeaves(); }
  }

  nextPage(): void {
    if (this.hasNextPage) { this.currentPage++; this.loadLeaves(); }
  }
}
